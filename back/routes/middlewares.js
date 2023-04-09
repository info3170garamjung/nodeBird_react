// 로그인 했는지 안했는지 검사하는 미들웨어
// app.use, req,res,next 는 미들웨어
// 미들웨어는 위에서부터 아래로 왼쪽에서 오른쪽으로 실행됨

exports.isLoggedIn = (req, res, next) => {
  if (req.isAuthenticated()) {  // passport에서 isAuthenticated 제공 , true= login
    next(); // next 사용법 1. next(에러관련 정보) => 에러처리 2. next(); 다음 미들웨어로감
  } else {
    res.status(401).send('로그인이 필요합니다.');
  }
};

exports.isNotLoggedIn = (req, res, next) => {
  if (!req.isAuthenticated()) {
    next();
  } else {
    res.status(401).send('로그인하지 않은 사용자만 접근 가능합니다.');
  }
};
