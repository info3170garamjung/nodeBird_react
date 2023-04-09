const express = require('express');
const { Op } = require('sequelize');
const { Post, Image, User, Comment } = require('../models');

const router = express.Router();

router.get('/', async (req, res, next) => { // GET /posts
  try {
    //req.query.lastId // lastId 받기
    const where = {};
    if (parseInt(req.query.lastId, 10)) { // 초기 로딩이 아닐 때
      where.id = { [Op.lt]: parseInt(req.query.lastId, 10)} // [Op.It] lastId 보다 작은
    } // 21 20 19 18 17 16 15 14 13 12 11 10 9 8 7 6 5 4 3 2 1

    const posts = await Post.findAll({  // 여러개 가져오기 (모든게시글가져오기)
      // 조건
      where,
      limit: 10, // 10개만 가져오기
      //offset: 0, // 게시글 추가 / 삭제할떄 문제가 있을수 있음 offset 대신 lastId를 더 많이 사용
      // offset: 100, // 101~101 //offset: 0,  1~10
      order: [
        ['createdAt', 'DESC'], // 게시글 내림차순
        [Comment, 'createdAt', 'DESC'], // 댓글 내림차순 정렬
    ], 

      // 중복/ 누락을 피할수 있음
      // where: { id: lastId },
      // limit: 10,
      include: [{
        model: User,
        attributes: ['id', 'nickname'],
      },  {
        model: Image,
      }, {
        model: Comment,
        include: [{
          model: User, // 댓글 작성자
          attributes: ['id', 'nickname'],
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

      // 21, 20, 19, 18, 17, 16, 15, 14, 13, 12, 11, 10, 9, 8, 7, 6, 5, 4, 3, 2, 1
        // 20-11 11-2 (중복, 로딩중 게시글 생성했을떄)
    });
    console.log(posts); // 서버에서 이 라우터가 실행됬는지 확인
    res.status(200).json(posts);
  } catch (error) {
    console.error(error);
    next(error);
  }
});

module.exports = router;