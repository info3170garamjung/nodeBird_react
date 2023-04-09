const express = require('express'); // import express = require('express');
const multer = require('multer'); //앱에 장착할수있지만 보통 라우터마다 장착한다.
const fs = require('fs'); // 파일 시스템 조작
const path = require('path');
const { Post, Image, Comment, User, Hashtag } = require('../models');
const router = express.Router();
const { isLoggedIn } = require('./middlewares');

try {
fs.accessSync('uploads'); // uploads 폴더 있는지 검사
} catch (error) {
  console.log('uploads 폴더가 없으므로 생성합니다. ')
  fs.mkdirSync('uploads'); // uploads폴더 생성
}

const upload = multer({ 
  storage: multer.diskStorage({ // 컴퓨터 하드디스크
    destination(req, file, done) {
      done(null, 'uploads');
    },
    filename(req, file, done) { // 제로초.png
      const ext = path.extname(file.originalname); // 확장자 추출(.png) // path를 통해서 파일의 확장자를 꺼내올수있음
      const basename = path.basename(file.originalname, ext); // 제로초 
      done(null, basename + '_' + new Date().getTime() + ext); // 제로초15184712891.png
    },
  }),
  limits: { fileSize: 20 * 1024 * 1024 }, // 20MB
});


router.post('/', isLoggedIn, upload.none(), async (req, res, next) => { // POST /post
  try {
    const hashtags = req.body.content.match(/#[^\s#]+/g);
    const post = await Post.create({ // 방금 생성했던 게시글이 post객체에 담김
      content: req.body.content,
      UserId: req.user.id,
    });

    if (hashtags) {
      const result = await Promise.all(hashtags.map((tag) => Hashtag.findOrCreate({ // 사용자 해시태그 입력시 새로운 문자열만 db에 저장한다
        // findOrCreate : 해쉬태그가 없을떄만 등록되고, 있을떄는 가져옴 , where 써줘야함
        where: { name: tag.slice(1).toLowerCase() },
      }))); // [[노드, true], [리액트, true]]
      await post.addHashtags(result.map((v) => v[0])); // 배열에서 1번째만 추출
    }

    if (req.body.image) {
      if (Array.isArray(req.body.image)) { // 이미지를 여러 개 올리면 image: [제로초.png, 부기초.png]
        const images = await Promise.all(req.body.image.map((image) => Image.create({ src: image }))); // images 배열을 시퀄라이즈에 생성
        // Promise.all 을통해서 images 접근할수있는 주소를 db에 저장(실제 이미지파일은 uploads 폴더에 저장)
        await post.addImages(images);
      } else { // 이미지를 하나만 올리면 image: 제로초.png
        const image = await Image.create({ src: req.body.image });
        await post.addImages(image);
      }
    }

    const fullPost = await Post.findOne({
      where: { id: post.id }, // 방금 생성한 게시글 가져오기
      include: [{
        model: Image, // 게시글에 있는 이미지
      }, {
        model: Comment, // 게시글 댓글
        include: [{
          model: User, // 댓글 작성자
          attributes: ['id', 'nickname'],
        }],
      }, {
        model: User, // 게시글 작성자
        attributes: ['id', 'nickname'],
      }, {
        model: User, // 게시글 좋아요 누른 사용자
        as: 'Likers', //  게시글작성자와 좋아요 누른사람 구별
        attributes: ['id'],
      }]
    })
    res.status(201).json(fullPost); // 정보를 완성해서 프론트로 돌려줌
  } catch(error) {
    console.error(error);
    next(error);
  }
});

router.get('/:postId', async (req, res, next) => { // GET /post/1
  try {
    const post = await Post.findOne({
      where: { id: req.params.postId },
    });
    if (!post) {
      return res.status(404).send('존재하지 않는 게시글입니다.');
    }
    const fullPost = await Post.findOne({
      where: { id: post.id }, // 방금 생성한 게시글 가져오기
      include: [{
        model: Post,
        as: 'Retweet', // 게시글이 Post.Retweet 으로 담김
        include: [{
          model: User, // 리트윗 게시글의 작성자
          attributes: ['id', 'nickname'],
        }, {
          model: Image, // 리트윗 게시글의 이미지
        }]
      }, {
        model: User,
        attributes: ['id', 'nickname'],
      }, {
        model: User,
        as: 'Likers',
        attributes: ['id', 'nickname'],
      }, {
        model: Image,
      }, {
        model: Comment, // 내 게시글의 댓글
        include: [{
          model: User, // 댓글의 작성자
          attributes: ['id', 'nickname'],
        }],
      }],
    })
    res.status(200).json(fullPost);
  } catch (error) {
    console.error(error);
    next(error);
  }
});

router.post('/:postId/retweet', isLoggedIn, async (req, res, next) => { // POST /post/1/retweet
  try {
    const post = await Post.findOne({ // 게시글 있는지 없는지 먼지 찾기
      where: { id: req.params.postId },
      include: [{
        model: Post,
        as: 'Retweet',
      }],
    });
    if (!post) {
      return res.status(403).send('존재하지 않는 게시글입니다.');
    }
    if (req.user.id === post.UserId || (post.Retweet && post.Retweet.UserId === req.user.id)) {  //** as:'Retweet' 을 include 해주면 post.Retweet이 생김
      // 내 아이디가  게시글 아이디  || 내게시글을 리트윗한 다른 게시글을 다시 리트윗
      return res.status(403).send('자신의 글은 리트윗할 수 없습니다.');
    }
    const retweetTargetId = post.RetweetId || post.id; // 리트윗한 게시글 retweetid , 아니면 그냥 id
    const exPost = await Post.findOne({
      where: {
        UserId: req.user.id,
        RetweetId: retweetTargetId,
      },
    });
    if (exPost) { // 이미 리트윗한걸 또 리트윗
      return res.status(403).send('이미 리트윗했습니다.'); 
    }
    const retweet = await Post.create({
      UserId: req.user.id,
      RetweetId: retweetTargetId,
      content: 'retweet',
    });
    const retweetWithPrevPost = await Post.findOne({ // 내가 어떤 글을 리트윗 했는지 
      where: { id: retweet.id },
      include: [{
        model: Post,
        as: 'Retweet', // 게시글이 Post.Retweet 으로 담김
        include: [{
          model: User, // 리트윗 게시글의 작성자
          attributes: ['id', 'nickname'],
        }, {
          model: Image, // 리트윗 게시글의 이미지
        }]
      }, {
        model: User,
        attributes: ['id', 'nickname'],
      }, {
        model: Image,
      }, {
        model: Comment, // 내 게시글의 댓글
        include: [{
          model: User, // 댓글의 작성자
          attributes: ['id', 'nickname'],
        }],
      }],
    })
    res.status(201).json(retweetWithPrevPost);
  } catch (error) {
    console.error(error);
    next(error);
  }
});

// 이미지 업로드용 라우터
// *** PostForm -> input name="image" 부분이 array 로 전달됨 
// array: 여러장 올릴수 있게 하기위해서 , single: 한장만 가능,  none(): 텍스트, json
// 순서 : Login 체크 -> upload를 여기서 올려줌  (req, res, next)는 이미지 업로드 후에 실행
router.post('/images', isLoggedIn, upload.array('image'), (req, res, next) => { // POST /post/images
  console.log(req.files); // 업로드된 이미지에 대한 정보
  res.json(req.files.map((v) => v.filename)); // 어디로 업로드됬는지 파일명등이 프론트로 보내짐
});


// parameter -> 주소부분이 동적으로 바뀜
router.post('/:postId/comment', isLoggedIn, async (req, res, next) => { // POST /post/?/comment
  try {
    // 주소 검사
    const post = await Post.findOne({
      where: {id: req.params.postId },
    });
    // 존재하는 포스트인지 확인
    if (!post) {
      return res.status(403).send('존재하지 않는 게시글입니다.');
    }
    const comment = await Comment.create({ // 방금 생성했던 게시글이 post객체에 담김
      content: req.body.content,
      PostId: parseInt(req.params.postId, 10), // 문자열에서 int 로 바꿔줌
      UserId: req.user.id, // 로그인 한뒤 라우터 접근할떄 deserializeUser 가 실행, req.user 접근이 가능해짐 
    });
    const fullComment = await Comment.findOne({
      where: { id: comment.id },
      include: [{
        model: User,
        attributes: ['id', 'nickname'],
      }],
    })
    res.status(201).json(fullComment); // 프론트로 돌려줌
  } catch(error) {
    console.error(error);
    next(error);
  }
});

router.patch('/:postId/like', isLoggedIn, async (req, res, next) => { // PATCH / post/1/like
  try {
    const post = await Post.findOne({ where: { id: req.params.postId }}); // 게시글이 있는지
    if (!post) {
      return res.status(403).send('게시글이 존재하지 않습니다.');
    }
    await post.addLikers(req.user.id); // db조작할떄 await 꼭 사용하기
    res.json({ PostId: post.id, UserId: req.user.id });
  } catch (error) {
    console.error(error);
    next(error);
  }
});

router.delete('/:postId/like', isLoggedIn, async (req, res, next) => { // DELETE / post/1/like
  try {
    const post = await Post.findOne({ where: { id: req.params.postId }});
    if (!post) {
      return res.status(403).send('게시글이 존재하지 않습니다.');
    }
    await post.removeLikers(req.user.id);
    res.json({ PostId: post.id, UserId: req.user.id });
  } catch (error) {
    console.error(error);
    next(error);
  }
});
/*
router.delete('/', (req, res, next) => { // DELETE /post
  res.json({ id: 1 });
});
*/

router.delete('/:postId', isLoggedIn, async (req, res, next) => { // DELETE /post/10
  try {
    await Post.destroy({
      where: {
        id: req.params.postId,
        UserId: req.user.id, // 내가쓴 게시글만 삭제 가능
      },
    });
    res.status(200).json({ PostId: parseInt(req.params.postId, 10) });
  } catch (error) {
    console.error(error);
    next(error);
  }
});



module.exports = router; // export default router;
// 노드는 import, export 지원은 하지만, require 사용
// 프론트에서는 웹팩이 import, export 한것을 require로 바꿔주지만, 노드는 웹팩을 사용하지 않아서 require 사용