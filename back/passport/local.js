
const passport = require('passport');
const { Strategy: LocalStrategy } = require('passport-local');
const bcrypt = require('bcrypt');
const { User } = require('../models');

// done 은 콜백같은것 
module.exports = () => {
  // front 에서 data.email -> 서버로가면 req.body.email 로 바뀜
  passport.use(new LocalStrategy({
    usernameField: 'email', // req.body 설정
    passwordField: 'password',
  }, async (email, password, done) => { // 로그인 전략
    try {
      const user = await User.findOne({
        where: { email: email }
      });
      // 패스포트에서 응답을 보내주지 않음
      // done으로 결과를 판단 (1번째: 서버에러, 2번쨰: 성공, 3번째:클라이언트에러)
      if (!user) { // 존재하지 않는 사용자
        return done(null, false, { reason: '존재하지 않는 이메일입니다!' });
      }
      const result = await bcrypt.compare(password, user.password);
      if (result) {
        return done(null, user); // 2번째 성공 자리에 사용자 정보 넘겨주기
      }
      return done(null, false, { reason: '비밀번호가 틀렸습니다.' });
    } catch (error) {
      console.error(error);
      return done(error);
    }
  }));
};

/*
const passport = require('passport');
const { Strategy: LocalStrategy } = require('passport-local');
const bcrypt = require('bcrypt');
const { User } = require('../models');

module.exports = () => {
  passport.use(new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password',
  }, async (email, password, done) => {
    try {
      const user = await User.findOne({
        where: { email }
      });
      if (!user) {
        return done(null, false, { reason: '존재하지 않는 이메일입니다!' });
      }
      const result = await bcrypt.compare(password, user.password);
      if (result) {
        return done(null, user);
      }
      return done(null, false, { reason: '비밀번호가 틀렸습니다.' });
    } catch (error) {
      console.error(error);
      return done(error);
    }
  }));
};
*/