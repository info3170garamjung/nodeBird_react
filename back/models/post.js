/*
module.exports = (sequelize, DataTypes) => {
  const Post = sequelize.define('Post', { 
    content: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    // as:'Retweet' 을 하면 PostId -> RetweetId 로 변경됨
  }, {
    charset: 'utf8mb4',
    collate: 'utf8mb4_general_ci', // 이모티콘 저장
  });
  Post.associate = (db) => {
    */
    /* 여기만 원래 주석
    db.Post.belongsTo(db.User); // 게시글은 작성자에게 속해있다. 
    db.Post.hasMany(db.Comment);
    db.Post.hasMany(db.Image);
    db.Post.belongsToMany(db.Hashtag, { through: 'PostHashtag' }); // ManyToMany 관계
    db.Post.belongsToMany(db.User,  { through: 'Like', as: 'Likers' }); // 사용자 - 게시글 좋아요 관계
    // 나중에 as에 따라서 post.getLikers처럼 게시글 좋아요 누른 사람을 가져오게됨.
    // as 를 사용해서 db.User에 대한 이름을 바꿔줌( 헷갈리지 않기위해 )
    db.Post.belongsTo(db.Post, { as: 'Retweet'} ) // 리트윗
    */
/*
    db.Post.belongsTo(db.User); // post.addUser, post.getUser, post.setUser
    db.Post.belongsToMany(db.Hashtag, { through: 'PostHashtag' }); // post.addHashtags
    db.Post.hasMany(db.Comment); // post.addComments, post.getComments
    db.Post.hasMany(db.Image); // post.addImages, post.getImages
    db.Post.belongsToMany(db.User, { through: 'Like', as: 'Likers' }) // post.addLikers, post.removeLikers
    db.Post.belongsTo(db.Post, { as: 'Retweet' }); // post.addRetweet
  };
  return Post;
};
*/

const DataTypes = require('sequelize');
const { Model } = DataTypes;

module.exports = class Post extends Model {
  static init(sequelize) {
    return super.init({
      // id가 기본적으로 들어있다.
      content: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      // RetweetId
    }, {
      modelName: 'Post',
      tableName: 'posts',
      charset: 'utf8mb4',
      collate: 'utf8mb4_general_ci', // 이모티콘 저장
      sequelize,
    });
  }
  static associate(db) {
    db.Post.belongsTo(db.User); // post.addUser, post.getUser, post.setUser
    db.Post.belongsToMany(db.Hashtag, { through: 'PostHashtag' }); // post.addHashtags
    db.Post.hasMany(db.Comment); // post.addComments, post.getComments
    db.Post.hasMany(db.Image); // post.addImages, post.getImages
    db.Post.belongsToMany(db.User, { through: 'Like', as: 'Likers' }) // post.addLikers, post.removeLikers
    db.Post.belongsTo(db.Post, { as: 'Retweet' }); // post.addRetweet
  }
};