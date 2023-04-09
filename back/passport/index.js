
const passport = require('passport');
const local = require('./local');
const { User } = require('../models');

module.exports = () => {
  // req.login 후 실행
  passport.serializeUser((user, done) => { // 서버쪽에 [{ id: 1, cookie: 'clhxy' }]
    done(null, user.id); // user 정보중 쿠키랑 묶어줄 아이디만 저장
  });

  passport.deserializeUser(async (id, done) => { // user 아이디를 통해서 db에서 유저 복구를 해줌
    try {
      const user = await User.findOne({ where: { id }});
      done(null, user); // req.user
    } catch (error) {
      console.error(error);
      done(error);
    }
  });

  local();
};

// 프론트에서 서버로는 cookie만 보내요(clhxy)
// 서버가 쿠키파서, 익스프레스 세션으로 쿠키 검사 후 id: 1 발견
// id: 1이 deserializeUser에 들어감
// req.user로 사용자 정보가 들어감

// 요청 보낼때마다 deserializeUser가 실행됨(db 요청 1번씩 실행)
// 실무에서는 deserializeUser 결과물 캐싱


