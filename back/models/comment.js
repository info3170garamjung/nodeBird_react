/*
module.exports = (sequelize, DataTypes) => {
  const Comment = sequelize.define('Comment', { 
    content: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    // belongsTo : 게시글, 사용자 등에 고유한 아이디가 붙는데 댓글에 어떤 사용자가 작성했는지, 몇번게시글아래에 달린 댓글인지 
    // 정보가 담겨있는 컬럼이 생김
    // UserId: {} 
    // PostId: {}
  }, {
    charset: 'utf8mb4',
    collate: 'utf8mb4_general_ci', // 이모티콘 저장
  });
  Comment.associate = (db) => {
    db.Comment.belongsTo(db.User);
    db.Comment.belongsTo(db.Post);
  };
  return Comment;
};
*/

const DataTypes = require('sequelize');
const { Model } = DataTypes;

module.exports = class Comment extends Model {
  static init(sequelize) {
    return super.init({
      // id가 기본적으로 들어있다.
      content: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      // UserId: 1
      // PostId: 3
    }, {
      modelName: 'Comment',
      tableName: 'comments', // tableName : 자동으로 소문자 복수형
      charset: 'utf8mb4',
      collate: 'utf8mb4_general_ci', // 이모티콘 저장
      sequelize,
    });
  }

  static associate(db) {
    db.Comment.belongsTo(db.User);
    db.Comment.belongsTo(db.Post);
  }
};