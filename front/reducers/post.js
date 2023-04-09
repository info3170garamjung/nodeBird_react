//import shortId from 'shortid';
//import produce from 'immer';
//import faker from 'faker';
import produce from '../util/produce';

// mock 데이터
export const initialState = {
  // User, Images, Comments 대문자 -> 정보사이의 관계가있으면 합쳐주는데, 대문자로 작성.
  
  mainPosts: [
    /*
    {
    id: 1, // 게시글 자체의 속성
    User: {
      id: 1,
      nickname: '제로초',
    },
    content: '첫 번째 게시글 #해시태그 #익스프레스', // 게시글 자체의 속성
    Images: [{
      id: shortId.generate(),
      src: 'https://bookthumb-phinf.pstatic.net/cover/137/995/13799585.jpg?udate=20180726',
    }, {
      id: shortId.generate(),
      src: 'https://gimg.gilbut.co.kr/book/BN001958/rn_view_BN001958.jpg',
    }, {
      id: shortId.generate(),
      src: 'https://gimg.gilbut.co.kr/book/BN001998/rn_view_BN001998.jpg',
    }],
    Comments: [{
      id: shortId.generate(), // id가 key가됨
      User: {
        id: shortId.generate(), // id가 key가됨
        nickname: 'nero',
      },
      content: '우와 개정판이 나왔군요~',
    }, {
      id: shortId.generate(),
      User: {
        id: shortId.generate(), // id가 key가됨
        nickname: 'hero',
      },
      content: '얼른 사고싶어요~',
    }]
  }
*/
],
  // 이미지 업로드 할떄 이미지 경로들이 저장
  imagePaths: [],
  // 데이터를 가져오려는 시도
  singlePost: null,
  hasMorePosts: true,
  loadPostLoading: false,
  loadPostDone: false,
  loadPostError: null,
  loadPostsLoading: false,
  loadPostsDone: false,
  loadPostsError: null,
  // 게시글 추가가 완료됬을떄 true로 바뀜
  addPostLoading: false,
  addPostDone: false,
  addPostError: null,
  likePostsLoading: false,
  likePostsDone: false,
  likePostsError: null,
  unlikePostsLoading: false,
  unlikePostsDone: false,
  unlikePostsError: null,
  removePostLoading: false, 
  removePostDone: false,  
  removePostError: null,  
  addCommentLoading: false,
  addCommentDone: false,
  addCommentError: null,
  uploadImagesLoading: false,
  uploadImagesDone: false,
  uploadImagesError: null,
  retweetLoading: false,
  retweetDone: false,
  retweetError: null,

};
  //faker 쓰기 직전에 faker.seed(123) 을 넣어서 랜덤값을 고정시키기
 // faker.seed(123);

 /*
// 함수 생성(서버에서 불러오는 데이터를 대체, 프론트 사가를 통해서 무한스크롤링을 구현)
export const generateDummyPost = (number) => Array(number).fill().map(() => ({
  id: shortId.generate(),
  User: {
    id: shortId.generate(),
    nickname: faker.name.findName(),
  },
  content: faker.lorem.paragraph(),
  Images: [{
    src: faker.image.image(),
  }],
  Comments: [{
    User: {
      id: shortId.generate(),
      nickname: faker.name.findName(),
    },
    content: faker.lorem.sentence(),
  }],
}));
*/

  /*
  
// 더미데이터 20개 만들기
// concat 사용시 앞에 대입을 해줘야함
initialState.mainPosts = initialState.mainPosts.concat(
  Array(20).fill().map(() => ({
  id: shortId.generate(),
    User: {
      id: shortId.generate(),
      nickname: faker.name.findName(), // faker 공식문서에 있음
    },
    content: faker.lorem.paragraph(),
    Images: [{
      src: faker.image.image(),
    }],
    Comments: [{
      User: {
        id: shortId.generate(),
        nickname: faker.name.findName(),
      },
      content: faker.lorem.sentence(),
      }],
    })),
  );
*/

// 게시글 작성하는 액션
// 액션 이름을 ADD_POST라는 상수로 선언

export const REMOVE_IMAGE = 'REMOVE_IMAGE';

export const UPLOAD_IMAGES_REQUEST = 'UPLOAD_IMAGES_REQUEST';
export const UPLOAD_IMAGES_SUCCESS = 'UPLOAD_IMAGES_SUCCESS';
export const UPLOAD_IMAGES_FAILURE = 'UPLOAD_IMAGES_FAILURE';

export const LIKE_POST_REQUEST = 'LIKE_POST_REQUEST';
export const LIKE_POST_SUCCESS = 'LIKE_POST_SUCCESS';
export const LIKE_POST_FAILURE = 'LIKE_POST_FAILURE';

export const UNLIKE_POST_REQUEST = 'UNLIKE_POST_REQUEST';
export const UNLIKE_POST_SUCCESS = 'UNLIKE_POST_SUCCESS';
export const UNLIKE_POST_FAILURE = 'UNLIKE_POST_FAILURE';

export const LOAD_POSTS_REQUEST = 'LOAD_POSTS_REQUEST';
export const LOAD_POSTS_SUCCESS = 'LOAD_POSTS_SUCCESS';
export const LOAD_POSTS_FAILURE = 'LOAD_POSTS_FAILURE';

export const ADD_POST_REQUEST = 'ADD_POST_REQUEST';
export const ADD_POST_SUCCESS = 'ADD_POST_SUCCESS';
export const ADD_POST_FAILURE = 'ADD_POST_FAILURE';

export const REMOVE_POST_REQUEST = 'REMOVE_POST_REQUEST';
export const REMOVE_POST_SUCCESS = 'REMOVE_POST_SUCCESS';
export const REMOVE_POST_FAILURE = 'REMOVE_POST_FAILURE';

export const ADD_COMMENT_REQUEST = 'ADD_COMMENT_REQUEST';
export const ADD_COMMENT_SUCCESS = 'ADD_COMMENT_SUCCESS';
export const ADD_COMMENT_FAILURE = 'ADD_COMMENT_FAILURE';

export const RETWEET_REQUEST = 'RETWEET_REQUEST';
export const RETWEET_SUCCESS = 'RETWEET_SUCCESS';
export const RETWEET_FAILURE = 'RETWEET_FAILURE';

export const LOAD_POST_REQUEST = 'LOAD_POST_REQUEST';
export const LOAD_POST_SUCCESS = 'LOAD_POST_SUCCESS';
export const LOAD_POST_FAILURE = 'LOAD_POST_FAILURE';

export const LOAD_USER_POSTS_REQUEST = 'LOAD_USER_POSTS_REQUEST';
export const LOAD_USER_POSTS_SUCCESS = 'LOAD_USER_POSTS_SUCCESS';
export const LOAD_USER_POSTS_FAILURE = 'LOAD_USER_POSTS_FAILURE';

export const LOAD_HASHTAG_POSTS_REQUEST = 'LOAD_HASHTAG_POSTS_REQUEST';
export const LOAD_HASHTAG_POSTS_SUCCESS = 'LOAD_HASHTAG_POSTS_SUCCESS';
export const LOAD_HASHTAG_POSTS_FAILURE = 'LOAD_HASHTAG_POSTS_FAILURE';

export const addPost = (data) => ({
  type: ADD_POST_REQUEST,
  data,
});

export const addComment = (data) => ({
  type: ADD_COMMENT_REQUEST,
  data,
});
// 함수로 만들기 
const dummyPost = (data) => ({
  // id: shortId.generate(),
 // content: data,
 id: data.id, // 변경
 content: data.content, // 변경
  User: {
    id: 1,
    nickname: '제로초',
  },
  Images: [],
  Comments: [],
});

/*
const dummyComment = (data) => ({
  id: shortId.generate(),
  content: data,
  User: {
    id: 1,
    nickname: '제로초',
  },
});
*/

// 이전 상태를 액션을 통해 다음 상태로 만들어내는 함수(불변성은 지키면서)
const reducer = (state = initialState, action) => produce(state, (draft) => {
    switch (action.type) {
      case LOAD_POST_REQUEST:
        draft.loadPostLoading = true;
        draft.loadPostDone = false;
        draft.loadPostError = null;
        break;
      case LOAD_POST_SUCCESS:
        draft.loadPostLoading = false;
        draft.loadPostDone = true;
        draft.singlePost = action.data;
        break;
      case LOAD_POST_FAILURE:
        draft.loadPostLoading = false;
        draft.loadPostError = action.error;
        break;

      case RETWEET_REQUEST: 
      draft.retweetLoading = true;
      draft.retweetDone = false;
      draft.retweetError = null;
      break;
    case RETWEET_SUCCESS: {
      draft.retweetLoading = false;
      draft.retweetDone = true;
      draft.mainPosts.unshift(action.data); // 리트윗된 게시글 메인포스트에 추가
      break;
    }
    case RETWEET_FAILURE: 
      draft.retweetLoading = false;
      draft.retweetError = action.error;
      break;


      case REMOVE_IMAGE:
        draft.imagePaths = draft.imagePaths.filter((v, i) => i !== action.data);
        break;
      case UPLOAD_IMAGES_REQUEST: 
      draft.uploadImagesLoading = true;
      draft.uploadImagesDone = false;
      draft.uploadImagesError = null;
      break;
    case UPLOAD_IMAGES_SUCCESS: {
      draft.imagePaths = action.data; // imagePaths에 파일명이 저장됨
      draft.uploadImagesLoading = false;
      draft.uploadImagesDone = true;
      break;
    }
    case UPLOAD_IMAGES_FAILURE: 
      draft.uploadImagesLoading = false;
      draft.uploadImagesError = action.error;
      break;
      case LIKE_POST_REQUEST: 
      draft.likePostLoading = true;
      draft.likePostDone = false;
      draft.likePostError = null;
      break;
    case LIKE_POST_SUCCESS: {
      const post = draft.mainPosts.find((v) => v.id === action.data.PostId); // post 찾기
      post.Likers.push({ id: action.data.UserId }); // 게시글에 좋아요누른 사람들 이름에 사용자 아이디 넣어줌
      draft.likePostLoading = false;
      draft.likePostDone = true;
      break;
    }
    case LIKE_POST_FAILURE: 
      draft.likePostLoading = false;
      draft.likePostError = action.error;
      break;
      case UNLIKE_POST_REQUEST: 
      draft.unlikePostLoading = true;
      draft.unlikePostDone = false;
      draft.unlikePostError = null;
      break;
    case UNLIKE_POST_SUCCESS: {
      const post = draft.mainPosts.find((v) => v.id === action.data.PostId); // post 찾기
      post.Likers = post.Likers.filter((v) => v.id !== action.data.UserId); 
      draft.unlikePostLoading = false;
      draft.unlikePostDone = true;
      break;
    }
    case UNLIKE_POST_FAILURE: 
      draft.unlikePostLoading = false;
      draft.unlikePostError = action.error;
      break;

      // 한페이지에서 액션이 같이 사용되지않을때, 상태가 공유할수있다.
    case LOAD_USER_POSTS_REQUEST:
    case LOAD_HASHTAG_POSTS_REQUEST:
    case LOAD_POSTS_REQUEST:
        draft.loadPostsLoading = true;
        draft.loadPostsDone = false;
        draft.loadPostsError = null;
        break;
    case LOAD_USER_POSTS_SUCCESS:
    case LOAD_HASHTAG_POSTS_SUCCESS:
    case LOAD_POSTS_SUCCESS:
        draft.loadPostsLoading = false;
        draft.loadPostsDone = true;
        // action.data(더미데이터) draft.mainPosts(기존데이터) 합쳐주기
        // draft.mainPosts = action.data.concat(draft.mainPosts);
        draft.mainPosts = draft.mainPosts.concat(action.data); // 아래에 추가로 post부르기
        // 게시글이 50개이상이면 더이상 데이터를 안가져옴
       // draft.hasMorePosts = draft.mainPosts.length < 50;
        draft.hasMorePosts = action.data.length === 10;
        break;
      case LOAD_USER_POSTS_FAILURE:
      case LOAD_HASHTAG_POSTS_FAILURE:
      case LOAD_POSTS_FAILURE:
        draft.loadPostsLoading = false;
        draft.loadPostsError = action.error;
        break;
      case ADD_POST_REQUEST: 
        draft.addPostLoading = true;
        draft.addPostDone = false;
        draft.addPostError = null;
        break;
      case ADD_POST_SUCCESS: 
        draft.addPostLoading = false;
        draft.addPostDone = true;
        draft.mainPosts.unshift(action.data); // 배열에 바로 unshift를 넣을수 있음 , 불변성 지킬필요없음 ... x
        draft.imagePaths = []; // 초기화
        break;
      case ADD_POST_FAILURE: 
        draft.addPostLoading = false;
        draft.addPostError = action.error;
        break;
      case REMOVE_POST_REQUEST: 
        draft.removePostLoading = true;
        draft.removePostDone = false;
        draft.removePostError = null;
        break;
      case REMOVE_POST_SUCCESS: 
        draft.removePostLoading = false;
        draft.removePostDone = true;
        draft.mainPosts =  draft.mainPosts.filter((v) => v.id !== action.data.PostId);
        break;
      case REMOVE_POST_FAILURE: 
        draft.removePostLoading = false;
        draft.removePostError = action.error;
        break;
      case ADD_COMMENT_REQUEST: 
        draft.addCommentLoading = true;
        draft.addCommentDone = false;
        draft.addCommentError = null;
        break;
      case ADD_COMMENT_SUCCESS: {
        const post = draft.mainPosts.find((v) => v.id === action.data.PostId); // routes > post PostId (대문자)
        post.Comments.unshift(action.data);
        draft.addCommentLoading = false;
        draft.addCommentDone = true;
        break;
      }
      case ADD_COMMENT_FAILURE:
        draft.addCommentLoading = false;
        draft.addCommentError = action.error;
        break;
      default:
        break;
      }
  });
     



/*
const reducer = (state = initialState, action) => {
	switch (action.type) {
    // 상수값을 사용할수 있다. 
    case ADD_POST_REQUEST: 
        return {
          ...state,
          addPostLoading: true,
          addPostDone: false,
          addPostError: null,
        }
    case ADD_POST_SUCCESS:
      return {
        ...state,
        //dummyPost 먼저 -> 가장 위에 추가됨 
        // action.data -> id, content가 들어있는 객체가 됨
        mainPosts: [dummyPost(action.data), ...state.mainPosts],
        addPostLoading: false,
        addPostDone: true,
      };
      case ADD_POST_FAILURE:
        return {
          ...state,
          addPostLoading: false,
          addPostError: action.error,
        }

        case REMOVE_POST_REQUEST: 
        return {
          ...state,
        removePostLoading: true,
        removePostDone: false,
        removePostError: null,
        }
    case REMOVE_POST_SUCCESS:
      return {
        ...state,
        mainPosts: state.mainPosts.filter((v) => v.id !== action.data),
      removePostLoading: false,
      removePostDone: true,
      };
      case REMOVE_POST_FAILURE:
        return {
          ...state,
        removePostLoading: false,
        removePostError: action.error,
        }

        case ADD_COMMENT_REQUEST: 
        return {
          ...state,
          addCommentLoading: true,
          addCommentDone: false,
          addCommentError: null,
        }
    case ADD_COMMENT_SUCCESS: {
     // action.data.content, postId, userId 에 접근가능
     const postIndex = state.mainPosts.findIndex((v) => v.id === action.data.postId);
     const post = { ...state.mainPosts[postIndex] };
     post.Comments = [dummyComment(action.data.content), ...post.Comments];
     const mainPosts = [...state.mainPosts];
     mainPosts[postIndex] = post; 
     
     return {
        ...state,
        mainPosts,
        addCommentLoading: false,
        addCommentDone: true,
      };
    };
      case ADD_COMMENT_FAILURE:
        return {
          ...state,
          addCommentLoading: false,
          addCommentError: action.error,
        }

		default:
			return state;
	}
};
*/


export default reducer;