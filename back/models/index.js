/*
const Sequelize = require('sequelize');
const env = process.env.NODE_ENV || 'development'; // 기본값 'development' 배포할땐 production으로 바꾸기 
const config = require('../config/config')[env]; // env = "development", config = development 객체
const db = {};

const sequelize = new Sequelize(config.database, config.username, config.password, config) // 시퀄라이즈(mysql2 사용)가 node, mySQL을 연결

db.Comment = require('./comment')(sequelize, Sequelize); // require 후, 함수를 실행
db.Hashtag = require('./hashtag')(sequelize, Sequelize);
db.Image = require('./image')(sequelize, Sequelize);
db.Post = require('./post')(sequelize, Sequelize);
db.User = require('./user')(sequelize, Sequelize);

Object.keys(db).forEach(modelName => { // 반복문으로 associate 실행, db 관계 연결
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;
*/

const Sequelize = require('sequelize');
const comment = require('./comment');
const hashtag = require('./hashtag');
const image = require('./image');
const post = require('./post');
const user = require('./user');

const env = process.env.NODE_ENV || 'development';
const config = require('../config/config')[env];
const db = {};

const sequelize = new Sequelize(config.database, config.username, config.password, config);

db.Comment = comment;
db.Hashtag = hashtag;
db.Image = image;
db.Post = post;
db.User = user;

Object.keys(db).forEach(modelName => {
  db[modelName].init(sequelize);
})

Object.keys(db).forEach(modelName => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;