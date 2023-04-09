/*
// mySQL -> table, sequelize -> model
module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define('User', { // model 'User' 대문자 , mySQL 소문자 복수 (규칙) // MySQL 에는 users 테이블 생성
    // id가 기본적으로 들어있다.
    email: {
      type: DataTypes.STRING(30),
      allowNull: false, // 필수
      unique: true // 고유한 값
    }, // Column
    nickname: {
      type: DataTypes.STRING(30),
      allowNull: false, 
    }, // Column
    password: {
      type: DataTypes.STRING(100), // 비밀번호는 암호화를 하기때문에 넉넉하게 잡기
      allowNull: false, 
    }, // Column
  }, {
    // user 모델에 대한 셋팅
    charset: 'utf8',
    collate: 'utf8_general_ci', // 한글 저장
  });
  User.associate = (db) => {
    db.User.hasMany(db.Post); // 유저가 포스트를 여러개 가질수 있다.
    db.User.hasMany(db.Comment);
    db.User.belongsToMany(db.Post, { through: 'Like', as: 'Liked' }); // 사용자 - 게시글 좋아요 관계 
    // 중간테이블 이름 설정가능 {through: 'Like' }
    // through : 테이블 이름을 바꿔줌
    // foreignKey : 컬럼에 아이디를 바꿔줌
    db.User.belongsToMany(db.User, { through: 'Follow', as: 'Followers', foreignKey: 'FollowingId'}); // 나를 먼저 찾기
    db.User.belongsToMany(db.User, { through: 'Follow', as: 'Followings', foreignKey: 'FollowerId'}); // 나를 먼저 찾기

  };
  return User;
}
*/
const DataTypes = require('sequelize');
const { Model } = DataTypes;

module.exports = class User extends Model {
  static init(sequelize) {
    return super.init({
      // id가 기본적으로 들어있다.
      email: {
        type: DataTypes.STRING(30), // STRING, TEXT, BOOLEAN, INTEGER, FLOAT, DATETIME
        allowNull: false, // 필수
        unique: true, // 고유한 값
      },
      nickname: {
        type: DataTypes.STRING(30),
        allowNull: false, // 필수
      },
      password: {
        type: DataTypes.STRING(100),
        allowNull: false, // 필수
      },
    }, {
      modelName: 'User',
      tableName: 'users',
      charset: 'utf8',
      collate: 'utf8_general_ci', // 한글 저장
      sequelize,
    });
  }
  static associate(db) {
    db.User.hasMany(db.Post);
    db.User.hasMany(db.Comment);
    db.User.belongsToMany(db.Post, { through: 'Like', as: 'Liked' })
    db.User.belongsToMany(db.User, { through: 'Follow', as: 'Followers', foreignKey: 'FollowingId' });
    db.User.belongsToMany(db.User, { through: 'Follow', as: 'Followings', foreignKey: 'FollowerId' });
  }
};