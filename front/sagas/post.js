import axios from 'axios';
//import shortId from 'shortid';
import { all, delay, fork, put, takeLatest, throttle, call } from 'redux-saga/effects';
import {
  LOAD_POST_FAILURE,
  LOAD_POST_REQUEST,
  LOAD_POST_SUCCESS,
  LOAD_POSTS_FAILURE,
  LOAD_POSTS_REQUEST,
  LOAD_POSTS_SUCCESS,
  //generateDummyPost,
  ADD_COMMENT_FAILURE,
  ADD_COMMENT_REQUEST,
  ADD_COMMENT_SUCCESS,
  ADD_POST_FAILURE,
  ADD_POST_REQUEST,
  ADD_POST_SUCCESS,
  REMOVE_POST_FAILURE,
  REMOVE_POST_REQUEST,
  REMOVE_POST_SUCCESS,
  LIKE_POST_REQUEST,
  LIKE_POST_SUCCESS,
  LIKE_POST_FAILURE,
  UNLIKE_POST_REQUEST,
  UNLIKE_POST_SUCCESS,
  UNLIKE_POST_FAILURE,
  UPLOAD_IMAGES_REQUEST,
  UPLOAD_IMAGES_SUCCESS,
  UPLOAD_IMAGES_FAILURE,
  RETWEET_REQUEST,
  RETWEET_SUCCESS,
  RETWEET_FAILURE,
  LOAD_HASHTAG_POSTS_REQUEST, 
  LOAD_HASHTAG_POSTS_SUCCESS,
  LOAD_HASHTAG_POSTS_FAILURE,
  LOAD_USER_POSTS_FAILURE, 
  LOAD_USER_POSTS_REQUEST, 
  LOAD_USER_POSTS_SUCCESS,
} from '../reducers/post';
import { ADD_POST_TO_ME, REMOVE_POST_OF_ME } from '../reducers/user';

function loadHashtagPostsAPI(data, lastId) {
  return axios.get(`/hashtag/${encodeURIComponent(data)}?lastId=${lastId || 0}`);
}

function* loadHashtagPosts(action) {
  try {
    console.log('loadHashtag console');
    const result = yield call(loadHashtagPostsAPI, action.data, action.lastId);
    yield put({
      type: LOAD_HASHTAG_POSTS_SUCCESS,
      data: result.data,
    });
  } catch (err) {
    console.error(err);
    yield put({
      type: LOAD_HASHTAG_POSTS_FAILURE,
      error: err.response.data,
    });
  }
}

function loadUserPostsAPI(data, lastId) {
  return axios.get(`/user/${data}/posts?lastId=${lastId || 0}`);
}

function* loadUserPosts(action) {
  try {
    const result = yield call(loadUserPostsAPI, action.data, action.lastId);
    yield put({
      type: LOAD_USER_POSTS_SUCCESS,
      data: result.data,
    });
  } catch (err) {
    console.error(err);
    yield put({
      type: LOAD_USER_POSTS_FAILURE,
      error: err.response.data,
    });
  }
}

function loadPostAPI(data) {
  return axios.get(`/post/${data}`);
}

function* loadPost(action) {
  try {
    const result = yield call(loadPostAPI, action.data);
    yield put({
      type: LOAD_POST_SUCCESS,
      data: result.data,
    });
  } catch (err) {
    console.error(err);
    yield put({
      type: LOAD_POST_FAILURE,
      data: err.response.data,
    });
  }
}

function retweetAPI(data) {
  return axios.post(`/post/${data}/retweet`);  
}

function* retweet(action) {
  try {
     const result = yield call(retweetAPI, action.data);  // action.data : imageFormData
    yield put({
      type: RETWEET_SUCCESS,
      data: result.data, // PostId, UserId
    });
  } catch (err) {
    console.error(err);
    yield put({
      type: RETWEET_FAILURE,
      error: err.response.data,
    });
  }
}


function uploadImagesAPI(data) {
  return axios.post('/post/images', data);  
}

function* uploadImages(action) {
  try {
     const result = yield call(uploadImagesAPI, action.data);  // action.data : imageFormData
    yield put({
      type: UPLOAD_IMAGES_SUCCESS,
      data: result.data, // PostId, UserId
    });
  } catch (err) {
    console.error(err);
    yield put({
      type: UPLOAD_IMAGES_FAILURE,
      error: err.response.data,
    });
  }
}


function likePostAPI(data) {
  return axios.patch(`/post/${data}/like`);  // patch 게시글 일부분 수정
}

function* likePost(action) {
  try {
     const result = yield call(likePostAPI, action.data);
    yield put({
      type: LIKE_POST_SUCCESS,
      data: result.data, // PostId, UserId
    });
  } catch (err) {
    console.error(err);
    yield put({
      type: LIKE_POST_FAILURE,
      error: err.response.data,
    });
  }
}

function unlikePostAPI(data) {
  return axios.delete(`/post/${data}/like`); // data: post.id
}

function* unlikePost(action) {
  try {
     const result = yield call(unlikePostAPI, action.data);
    yield put({
      type: UNLIKE_POST_SUCCESS,
      data: result.data,
    });
  } catch (err) {
    console.error(err);
    yield put({
      type: UNLIKE_POST_FAILURE,
      error: err.response.data,
    });
  }
}



function loadPostsAPI(lastId) {
  return axios.get(`/posts?lastId=${lastId || 0}`); // get에 데이터를 못넣기때문에 쿼리스트링사용 (2번쨰 자리 withCredentials)
  // lastId가 undefined 의 경우 0으로 만들어줌
  // get에서 데이터를 넣으려면 주소뒤에 ? key = value (주소에 데이터값이 포함됨)
  // get은 데이터 캐싱이 가능 
}

function* loadPosts(action) {
  try {
     const result = yield call(loadPostsAPI, action.lastId);
    yield put({
      type: LOAD_POSTS_SUCCESS,
      data: result.data,
    });
  } catch (err) {
    console.error(err);
    yield put({
      type: LOAD_POSTS_FAILURE,
      error: err.response.data,
    });
  }
}


function addPostAPI(data) {
  return axios.post('/post', data) // 서버의 요청 보내기
}

// saga는 동시에 여러 액션을 디스패치 할수 있기때문에, 
// 어떤 동작이 여러 reducer에 데이터를 동시에 바꿔야하면 액션을 여러번 호출해주면됨
function* addPost(action) {
  try {
  const result = yield call(addPostAPI, action.data)  // json(post)에서  result.data 안에 들어감
 // const id = shortId.generate(); 
  yield put({
    type: ADD_POST_SUCCESS,
     data: result.data, // 객체 모양은 마음대로 변경 가능
	//	data: {
//		id,
	//	content: action.data,
	//	}
  });
  yield put({
		type: ADD_POST_TO_ME,
    data: result.data.id, // 게시글 id를 넘겨줘야함(현재 id가 없기떄문에, id를 generate해줌)
		})
} catch(err) {
    yield put({ 
      type: ADD_POST_FAILURE, 
      error: err.response.data,
    })
  }
}

function removePostAPI(data) {
  return axios.delete(`/post/${data}`); // DELETE /post/post.id
} // delete에는 data 매개변수 안됨

function* removePost(action) {
  try {
  const result = yield call(removePostAPI, action.data) 
  yield put({             // post reducer 조작부분
    type: REMOVE_POST_SUCCESS,
    data: result.data,
  });
  yield put({           // user reducer 조작부분
    type: REMOVE_POST_OF_ME,          
		data: action.data,
		});
} catch(err) {
  console.error(err);
    yield put({ 
      type: REMOVE_POST_FAILURE, 
      error: err.response.data,
    });
  }
}


function addCommentAPI(data) {
  return axios.post(`/post/${data.postId}/comment`, data) // POST /post/1/comment
}

function* addComment(action) {
  try {
  const result = yield call(addCommentAPI, action.data) 
  yield put({
    type: ADD_COMMENT_SUCCESS,
    data: result.data, // 넘겨주기
   // data: result.data
  });
} catch(err) {
  console.error(err);
    yield put({ 
      type: ADD_COMMENT_FAILURE, 
      error: err.response.data,
    })
  }
}

function* watchLoadHashtagPosts() {
  yield takeLatest(LOAD_HASHTAG_POSTS_REQUEST, loadHashtagPosts);
}

function* watchLoadUserPosts() {
  yield takeLatest(LOAD_USER_POSTS_REQUEST, loadUserPosts);
}

function* watchLoadPost() {
  yield takeLatest(LOAD_POST_REQUEST, loadPost);
}

function* watchRetweet() {
  yield takeLatest(RETWEET_REQUEST, retweet);
}

function* watchUploadImages() {
  yield takeLatest(UPLOAD_IMAGES_REQUEST, uploadImages);
}

function* watchLikePost() {
  yield takeLatest(LIKE_POST_REQUEST, likePost);
}

function* watchUnlikePost() {
  yield takeLatest(UNLIKE_POST_REQUEST, unlikePost);
}

function* watchLoadPosts() {
  yield throttle(2000, LOAD_POSTS_REQUEST, loadPosts);
}

function* watchAddPost() {
  yield takeLatest(ADD_POST_REQUEST, addPost);
}

function* watchRemovePost() {
  yield takeLatest(REMOVE_POST_REQUEST, removePost);
}


function* watchAddComment() {
  yield takeLatest(ADD_COMMENT_REQUEST, addComment);
}



export default function* postSaga() {
  yield all([
    fork(watchLoadUserPosts),
    fork(watchLoadHashtagPosts),
    fork(watchLoadPost),
    fork(watchRetweet),
    fork(watchUploadImages),
    fork(watchLikePost),
    fork(watchUnlikePost),
    fork(watchAddPost),
    fork(watchLoadPosts),
    fork(watchRemovePost),
    fork(watchAddComment),
  ]);
}