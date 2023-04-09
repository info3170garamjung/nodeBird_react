/*
const http = require('http'); // http 모듈이 서버

const server = http.createServer((req, res) => {
console.log(req.url, req.method);
res.write('Hello node1');
res.end('Hello node');
});
server.listen(3065, () => {
  console.log('서버 실행중')
});

// app.js 를 실행하면 node runtime이 코드를 실행해서 http가 서버역할을 해줌
*/

const express = require('express');
const cors = require('cors');
const session = require('express-session');
const cookieParser = require('cookie-parser');
const passport = require('passport');
const dotenv = require('dotenv');
const morgan = require('morgan');
const path = require('path');
const hpp = require('hpp');
const helmet = require('helmet');

const postsRouter = require('./routes/posts');
const postRouter = require('./routes/post');
const userRouter = require('./routes/user')
const passportConfig = require('./passport'); 
const hashtagRouter = require('./routes/hashtag');
// 서버 실행할때 db sequelize 연결 됨
const db = require('./models');

const app = express(); // 호출

dotenv.config();
db.sequelize.sync()
  .then(() => {
    console.log('db 연결 성공');
  })
  .catch(console.error);

  passportConfig();

  if (process.env.NODE_ENV === 'production') {
    app.use(morgan('combined')); // 로그가 자세해짐 (접속자의 IP..)
    app.use(hpp()); // 보안 
    app.use(helmet()); // 보안

  } else {
    app.use(morgan('dev'));
  }

  app.use(cors({
    //origin: 'https://nodebird.com'
  //  origin: 'http://localhost:3060', // or true
   // origin: true,
    // origin: true로 설정해두면 * 대신 보낸곳의 주소가 자동으로 들어감
    origin: ['http://localhost:3060', 'nodebird.com'],
    credentials: true, // cookie 같이 전달
  }));

  // static 미들웨어, 현재폴더(back) + uploads
  // '/' -> localhost3065/  프론트에서 사진을 접근할떄 서버 폴더구조를 몰라도됨(보안)
app.use('/', express.static(path.join(__dirname, 'uploads')))


  // get, listen 등 다른 라우터들 보다 위에 위치
  // front에서 보낸 데이터를 이 exptress가 해석을 해서 req.body에 넣어줌
// 프론트 json 형식의 데이터를 req.body 안에 넣어줌
app.use(express.json());
  // form submit 을 했을떄 urlencoded 방식으로 데이터가 넘어와서 데이터를 req.body안에 넣어줌
app.use(express.urlencoded( { extended: true} ));
app.use(cookieParser(process.env.COOKIE_SECRET));
app.use(session({
  saveUninitialized: false,
  resave: false,
  secret: process.env.COOKIE_SECRET,
}));
app.use(passport.initialize());
app.use(passport.session());

app.get('/', (req, res) => { // get: 메서드 '/': url
  res.send('hello express');
});

/*
app.get('/', (req, res) => { // 주소창
  res.send('hello api');
});

app.get('/posts', (req, res) => {
// 데이터는 json으로 표현
// api는 json 객체를 응답
res.json([
  {id: 1, content: 'hello'}, // 정하기
  {id: 2, content: 'hello2'},
  {id: 3, content: 'hello3'},
]);
});
*/

// 브라우저 주소창은 get요청 
// post, delete 요청을 보내려면 axios, tool 등 사용 

// resAPI  -> get, post, put delete를 정확히 지키는것
// app.get -> 가져오다
// app.post -> 생성하다
// app.put -> 전체 수정
// app.delete -> 제거
// app.patch -> 부분 수정
// app.options -> 찔러보기 (요청 보낼수 있는지)
// app.head -> 헤더만 가져오기 (헤더/바디)

// app.post('/login') => 메인 페이지를 가져온다
// app.get('/post') => 게시글 가져오면서 조회수 1 올린다. (애매하면 post 사용 )


// 라우터 분리
app.use('/posts', postsRouter);
app.use('/post', postRouter); 
app.use('/user', userRouter);
app.use('/hashtag', hashtagRouter);
// 에러처리 미들웨어 내부적으로 존재 
// 기본 에러처리 미들웨어를 변경 가능 (에러를 특별히 처리하고 싶을떄)
//app.use((err, req, res, next) => { // 매개변수 4개

//});

app.listen(80, () => {
  console.log('서버 실행 중!');
});