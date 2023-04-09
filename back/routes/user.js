const express = require('express');
const bcrypt = require('bcrypt');
const passport = require('passport');
const { Op } = require('sequelize');
const { User, Post, Image, Comment } = require('../models');
const { isLoggedIn, isNotLoggedIn } = require('./middlewares');
const router = express.Router();

// 매번 사용자정보를 복구 (새로고침 할떄마다)
router.get('/', async (req, res, next) => { // GET /user
  console.log(req.headers); // headers 안에 쿠키가 들어있음
  console.log()
  try {
    if (req.user) { // 로그인되었을때
    const fullUserWithoutPassword = await User.findOne({
      where: {id: req.user.id},
      attributes: {
        exclude: ['password']
      },
      include: [{
        model: Post,
        attributes: ['id'], // id 만 가져옴
      }, {
        model: User,
        as: 'Followings',
        attributes: ['id'],
      }, {
        model: User,
        as: 'Followers',
        attributes: ['id'],
      }]
    })
      res.status(200).json(fullUserWithoutPassword);
    } else {
      res.status(200).json(null);
    }
  } catch (error) {
    console.error(error);
 next(error);
}
});

router.get('/followers', isLoggedIn, async (req, res, next) => { // GET /user/followers
  try {
    const user = await User.findOne({ where: { id: req.user.id }}); // 나를 먼저 찾기
    if (!user) {
      res.status(403).send('없는 사람을 찾으려고 하시네요?');
    }
    const followers = await user.getFollowers({
      limit: parseInt(req.query.limit, 10),
    });
    res.status(200).json(followers);
  } catch (error) {
    console.error(error);
    next(error);
  }
});

router.get('/followings', isLoggedIn, async (req, res, next) => { // GET /user/followings
  try {
    const user = await User.findOne({ where: { id: req.user.id }}); // 나를 찾기
    if (!user) {
      res.status(403).send('없는 사람을 찾으려고 하시네요?');
    }
    const followings = await user.getFollowings({
      limit: parseInt(req.query.limit, 10),
    });
    res.status(200).json(followings);
  } catch (error) {
    console.error(error);
    next(error);
  }
});


// 특정한 사용자를 가져오는 라우터
router.get('/:userId', async (req, res, next) => { // GET /user/3
  try {
    const fullUserWithoutPassword = await User.findOne({
      where: { id: req.params.userId },
      attributes: {
        exclude: ['password']
      },
      include: [{
        model: Post,
        attributes: ['id'],
      }, {
        model: User,
        as: 'Followings',
        attributes: ['id'],
      }, {
        model: User,
        as: 'Followers',
        attributes: ['id'],
      }]
    })
    if (fullUserWithoutPassword) {
      const data = fullUserWithoutPassword.toJSON(); 
      // 시퀄라이즈에서 불러온데이터는 toJSON을 사용해서 쓸수있는데이터로 바꿔줌
      data.Posts = data.Posts.length; // 이렇게 하면 아이디는없고 갯수만 들어있어있음
      data.Followings = data.Followings.length; // 개인정보 침해 예방
      data.Followers = data.Followers.length;
      res.status(200).json(data);
    } else {
      res.status(404).json('존재하지 않는 사용자입니다.');
    }
  } catch (error) {
    console.error(error);
    next(error);
  }
});

router.get('/:userId/posts', async (req, res, next) => { // GET /user/1/posts
  try {
    const where = { UserId: req.params.userId };
    if (parseInt(req.query.lastId, 10)) { // 초기 로딩이 아닐 때
      where.id = { [Op.lt]: parseInt(req.query.lastId, 10)}
    } // 21 20 19 18 17 16 15 14 13 12 11 10 9 8 7 6 5 4 3 2 1
    const posts = await Post.findAll({
      where,
      limit: 10,
      order: [['createdAt', 'DESC']],
      include: [{
        model: User,
        attributes: ['id', 'nickname'],
      }, {
        model: Image,
      }, {
        model: Comment,
        include: [{
          model: User,
          attributes: ['id', 'nickname'],
          order: [['createdAt', 'DESC']],
        }],
      }, {
        model: User, // 좋아요 누른 사람
        as: 'Likers',
        attributes: ['id'],
      }, {
        model: Post,
        as: 'Retweet',
        include: [{
          model: User,
          attributes: ['id', 'nickname'],
        }, {
          model: Image,
        }]
      }],
    });
    res.status(200).json(posts);
  } catch (error) {
    console.error(error);
    next(error);
  }
});


// done에 들어있는 인자들을 여기서 전달 받음
// req, res, next 를 추가하여 미들웨어를 확장
// passport authenticate 는 req, res, next 를 쓸수없는 미들웨어인데 이것을 확장시켜줌
router.post('/login', isNotLoggedIn, (req, res, next) => { // POST /user/login
  passport.authenticate('local', (err, user, info) => {
    if (err) {
      console.error(err);
      return next(err);
    }
    if (info) { // 클라이언트에러
      return res.status(401).send(info.reason);
    }
    return req.login(user, async (loginErr) => { // 패스포트 로그인
      if (loginErr) {
        console.error(loginErr);
        return next(loginErr);
      }
      // Posts, Followings, Follwers 추가, Password 삭제
      const fullUserWithoutPassword = await User.findOne({
        where: {id: user.id},
        // attributes : 전달해주고 싶은 데이터만 고를수있음
      //  attributes: [ 'id', 'nickname', 'email'],
        attributes: {
          // 전체 데이터중 비밀번호만 뺴고 가져옴
          exclude: ['password']
        },
        // include 해준부분의 정보를 가져와줌
        include: [{
          // hasMany 라서 model: Post 가 복수형이 되어 me.Posts가 됨
          //models > user.js 에서 associate 의 include한 부분을 그대로
          model: Post,
          attributes: ['id'],
        }, {
          model: User,
          as: 'Followings',
          attributes: ['id'],
        }, {
          model: User,
          as: 'Followers',
          attributes: ['id'],
        }]
      })
      return res.status(200).json(fullUserWithoutPassword); // 사용자 정보를 프론트로 넘겨줌
    }); // 패스포트 로그인
  }) (req, res, next);
}); // 전략 실행

router.post('/', isNotLoggedIn, async (req, res, next) => { // POST / user/ (saga(http://localhost:3065/user) 일치)
  try {
   const exUser = await User.findOne({
      where : { // 조건 
        email: req.body.email,
      }
    });
    if (exUser) {
      return res.status(403). send('이미 사용중인 아이디입니다.');
    }
  const hashedPassword = await bcrypt.hash(req.body.password, 12); // 10-13
  await User.create({ // table 안에 데이터를 넣음 
  // sigup페이지에서 onSubmit을 할떄 email,password,nickname 데이터를 dispatch 
  // sage signUp 
    email: req.body.email,
    nickname: req.body.nickname,
    password: hashedPassword, // 암호화된 비밀번호를 넣어줌
  });
  //res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3060')
  res.status(201).send('ok');
} catch (error) {
  console.error(error);
  next(error); // next를 통해 에러 보내기 (에러가 한번에 처리됨) // status 500
}
});

router.post('/logout', isLoggedIn, (req, res) => {
  req.logout(() => {});
  req.session.destroy(); // 쿠키, 아이디 삭제
  res.send('ok');
});

// 닉네임 수정
router.patch('/nickname', isLoggedIn, async (req, res, next) => {
  try {
    await User.update({
      nickname: req.body.nickname, // 프론트에서 제공한 닉네임
    }, {
      where: { id: req.user.id }, // 조건
    });
    res.status(200).json({ nickname: req.body.nickname }); // 바뀐 닉네임
  } catch (error) {
    console.error(error);
    next(error);
  }
});



router.patch('/:userId/follow', isLoggedIn, async (req, res, next) => { // PATCH /user/1/follow
  try {
    const user = await User.findOne({ where: { id: req.params.userId }});  // 유저가 있는지
    if (!user) {
      res.status(403).send('없는 사람을 팔로우하려고 하시네요?');
    }
    await user.addFollowers(req.user.id); // 팔로우 버튼을 누른 사용자는 팔로워가됨 (내 아이디)
    res.status(200).json({ UserId: parseInt(req.params.userId, 10) }); // 상대방 아이디
  } catch (error) {
    console.error(error);
    next(error);
  }
});

router.delete('/:userId/follow', isLoggedIn, async (req, res, next) => { // DELETE /user/1/follow
  try {
    const user = await User.findOne({ where: { id: req.params.userId }});  
    if (!user) {
      res.status(403).send('없는 사람을 언팔로우하려고 하시네요?');
    }
    await user.removeFollowers(req.user.id);
    res.status(200).json({ UserId: parseInt(req.params.userId, 10) });
  } catch (error) {
    console.error(error);
    next(error);
  }
});


router.delete('/follower/:userId', isLoggedIn, async (req, res, next) => { // DELETE /user/follower/2
  try {
    const user = await User.findOne({ where: { id: req.params.userId }}); // 상대아이디를 찾기
    if (!user) {
      res.status(403).send('없는 사람을 차단하려고 하시네요?');
    }
    await user.removeFollowings(req.user.id);
    res.status(200).json({ UserId: parseInt(req.params.userId, 10) });
  } catch (error) {
    console.error(error);
    next(error);
  }
});




module.exports = router;