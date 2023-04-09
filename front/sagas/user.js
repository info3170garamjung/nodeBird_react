
import { all, delay, fork, put, takeLatest, call } from 'redux-saga/effects';
import axios from 'axios';
import {
  LOAD_USER_FAILURE,
  LOAD_USER_REQUEST,
  LOAD_USER_SUCCESS,
  CHANGE_NICKNAME_REQUEST,
  CHANGE_NICKNAME_SUCCESS,
  CHANGE_NICKNAME_FAILURE,
  LOAD_MY_INFO_FAILURE,
  LOAD_MY_INFO_REQUEST,
  LOAD_MY_INFO_SUCCESS,
  LOG_IN_FAILURE,
  LOG_IN_REQUEST,
  LOG_IN_SUCCESS,
  LOG_OUT_FAILURE,
  LOG_OUT_REQUEST,
  LOG_OUT_SUCCESS,
  SIGN_UP_FAILURE,
  SIGN_UP_REQUEST,
  SIGN_UP_SUCCESS,
  FOLLOW_FAILURE,
  FOLLOW_REQUEST,
  FOLLOW_SUCCESS,
  UNFOLLOW_FAILURE,
  UNFOLLOW_REQUEST,
  UNFOLLOW_SUCCESS,
  LOAD_FOLLOWERS_FAILURE,
  LOAD_FOLLOWERS_REQUEST, 
  LOAD_FOLLOWERS_SUCCESS, 
  LOAD_FOLLOWINGS_FAILURE,
  LOAD_FOLLOWINGS_REQUEST, 
  LOAD_FOLLOWINGS_SUCCESS,
  REMOVE_FOLLOWER_FAILURE,
  REMOVE_FOLLOWER_REQUEST, 
  REMOVE_FOLLOWER_SUCCESS,
} from '../reducers/user';
import loadCustomRoutes from 'next/dist/lib/load-custom-routes';

function removeFollowerAPI(data) {
  return axios.delete(`/user/follower/${data}`);
}

function* removeFollower(action) {
  try {
    const result = yield call(removeFollowerAPI, action.data);
    yield put({
      type: REMOVE_FOLLOWER_SUCCESS,
      data: result.data,
    });
  } catch (err) {
    console.error(err);
    yield put({
      type: REMOVE_FOLLOWER_FAILURE,
      error: err.response.data,
    });
  }
}



function loadFollowersAPI(data) {
  return axios.get('/user/followers', data);
}

function* loadFollowers(action) {
  try {
    const result = yield call(loadFollowersAPI, action.data);
    yield put({
      type: LOAD_FOLLOWERS_SUCCESS,
      data: result.data,
    });
  } catch (err) {
    console.error(err);
    yield put({
      type: LOAD_FOLLOWERS_FAILURE,
      error: err.response.data,
    });
  }
}

function loadFollowingsAPI(data) {
  return axios.get('/user/followings', data);
}

function* loadFollowings(action) {
  try {
    const result = yield call(loadFollowingsAPI, action.data);
    yield put({
      type: LOAD_FOLLOWINGS_SUCCESS,
      data: result.data,
    });
  } catch (err) {
    console.error(err);
    yield put({
      type: LOAD_FOLLOWINGS_FAILURE,
      error: err.response.data,
    });
  }
}

function changeNicknameAPI(data) { 
  return axios.patch('/user/nickname', { nickname: data}); 
}

function* changeNickname(action) {
  try {
     const result = yield call(changeNicknameAPI, action.data);
    console.log(result);
    yield put({
      type: CHANGE_NICKNAME_SUCCESS,
      data: result.data,
    });
  } catch (err) {
    console.error(err);
    yield put({
      type: CHANGE_NICKNAME_FAILURE,
      error: err.response.data,
    });
  }
}

function loadUserAPI(data) {
  return axios.get(`/user/${data}`);
}

function* loadUser(action) {
  try {
    const result = yield call(loadUserAPI, action.data);
    yield put({
      type: LOAD_USER_SUCCESS,
      data: result.data,
    });
  } catch (err) {
    console.error(err);
    yield put({
      type: LOAD_USER_FAILURE,
      error: err.response.data,
    });
  }
}


function loadMyInfoAPI() { 
  return axios.get('/user'); // get, delete는 데이터가 없음  , get 사용시 2번쨰 자리에 withCredentials 
}

function* loadMyInfo() {
  try {
     const result = yield call(loadMyInfoAPI);
    console.log(result);
    yield put({
      type: LOAD_MY_INFO_SUCCESS,
      data: result.data,
    });
  } catch (err) {
    console.error(err);
    yield put({
      type: LOAD_MY_INFO_FAILURE,
      error: err.response.data,
    });
  }
}

function logInAPI(data) {
  
  return axios.post('/user/login', data) // 로그인을 할떄 실제 데이터를 넣어서 요청 보내기
}

// call : 동기 함수호출, 로그인 logInAPI가 리턴할떄까지 기다려서 result에 넣어줌 (then)
// fork : 비동기 함수호출, 요청보내고 결과기다리지않고 바로 다음줄이 실행됨
// yield : await 이랑 비슷, 테스트할때 좋음
// 예를들면 
/*
  const l = logIn({ type: 'LOG_IN_REQUEST', data: {id: 'zerocho@gmail.com' }})
  l.next(); // 첫번쨰 yield 실행
  l.next(); // 두번째 yield 실행
*/
function* logIn(action) {
  // 성공 결과는 result.data,
  // 실패 결과는 err.response.data에 담겨있음
  try {
  // action.type , action.data = 로그인데이터.
  // logInAPI 에 action.data를 넣어주면 data가 loginAPI로 들어감 
  // 함수호출할때 loginAPI(action.data) 이렇게 호출
  // 하지만 call, fork를 사용하면 call(logInAPI, action.data); 이런식으로 써줘야함
  // 첫번째 자리가 함수 두번째 자리부터 함수의 매개변수 
  const result = yield call(logInAPI, action.data) // 서버요청 결과값을 받기
    // 현재 서버가 없기떄문에 call(logInAPI)하면 에러
 // yield delay(1000);
  yield put({ // success, failure는 saga가 put 으로 호출
    type: LOG_IN_SUCCESS,
    data: result.data, // 서버로 부터 사용자 정보 받아오기
   // data: result.data
  });
} catch(err) {
    yield put({ // put => dispatch 역할, 
      type: LOG_IN_FAILURE, // type,data 액션 객체
      error: err.response.data,
    })
  }
}

function logOutAPI() {
  return axios.post('/user/logout') // 서버의 요청 보내기
}

function* logOut() {
  try {
  yield call(logOutAPI) 
  yield put({
    type: LOG_OUT_SUCCESS,
   // data: result.data
  });
} catch(err) {
  console.error(err);
    yield put({ 
      type: LOG_OUT_FAILURE, 
      error: err.response.data,
    })
  }
}

function signUpAPI(data) {
  // post/put/patch 는 데이터를 넘길수 있다. 
  return axios.post('/user', data); // data(email, password, nickname 객체가 들어있음)
}

function* signUp(action) {
  try {
     const result = yield call(signUpAPI, action.data);
    //yield delay(1000);
    console.log(result);
    yield put({
      type: SIGN_UP_SUCCESS,
    });
  } catch (err) {
    console.error(err);
    yield put({
      type: SIGN_UP_FAILURE,
      error: err.response.data,
    });
  }
}

function followAPI(data) {
  return axios.patch(`/user/${data}/follow`);
}

function* follow(action) {
  try {
   const result = yield call(followAPI, action.data);
  //  yield delay(1000);
    yield put({
      type: FOLLOW_SUCCESS,
      data: result.data,
    });
  } catch (err) {
    console.error(err);
    yield put({
      type: FOLLOW_FAILURE,
      error: err.response.data,
    });
  }
}

function unfollowAPI(data) {
  return axios.delete(`/user/${data}/follow`); // data에 사용자 아이디 넣어주기
}

function* unfollow(action) {
  try {
    const result = yield call(unfollowAPI, action.data);
    // yield delay(1000);
    yield put({
      type: UNFOLLOW_SUCCESS,
      data: result.data,
    });
  } catch (err) {
    console.error(err);
    yield put({
      type: UNFOLLOW_FAILURE,
      error: err.response.data,
    });
  }
}

function* watchLoadUser() {
  yield takeLatest(LOAD_USER_REQUEST, loadUser);
}

function* watchRemoveFollower() {
  yield takeLatest(REMOVE_FOLLOWER_REQUEST, removeFollower);
}

function* watchLoadFollowers() {
  yield takeLatest(LOAD_FOLLOWERS_REQUEST, loadFollowers);
}

function* watchLoadFollowings() {
  yield takeLatest(LOAD_FOLLOWINGS_REQUEST, loadFollowings);
}

function* watchChangeNickname() {
  yield takeLatest(CHANGE_NICKNAME_REQUEST, changeNickname);
}

function* watchLoadMyInfo() {
  yield takeLatest(LOAD_MY_INFO_REQUEST, loadMyInfo);
}

function* watchFollow() {
  yield takeLatest(FOLLOW_REQUEST, follow);
}

function* watchUnfollow() {
  yield takeLatest(UNFOLLOW_REQUEST, unfollow);
}

function* watchLogIn() {
  // LOG_IN_REQUEST -> type, data // LOG_IN_REQUEST 액션자체가 function login(action) 에 전달
  yield takeLatest(LOG_IN_REQUEST, logIn);
  // take: LOG_IN액션이 실행될까지 기다림
  // lOG_IN 액션이 실행되면 logIn generator 함수가 실행됨
}

function* watchLogOut() {
  // yield take -> 일회용 
  // login, logout 하면 다음 login 할떄 이벤트리스너?가 사라짐
  // while로 감싸서 무한하게 실행가능
  yield takeLatest(LOG_OUT_REQUEST, logOut);
}

function* watchSignUp() {
  yield takeLatest(SIGN_UP_REQUEST, signUp);
}



export default function* userSaga() {
  yield all([
    fork(watchLoadUser),
    fork(watchRemoveFollower),
    fork(watchLoadFollowers),
    fork(watchLoadFollowings),
    fork(watchChangeNickname),
    fork(watchLoadMyInfo),
    fork(watchFollow),
    fork(watchUnfollow),
    fork(watchLogIn),
    fork(watchLogOut),
    fork(watchSignUp),
  ]);
}