import { all, fork } from 'redux-saga/effects';
import axios from 'axios';
import postSaga from './post';
import userSaga from './user';

import { backUrl } from '../config/config';
//axios.defaults.baseURL = 'http://localhost:3065';
axios.defaults.baseURL = backUrl;
axios.defaults.withCredentials = true; // saga에서 보내는 axios 요청에 적용
// conbineReducer 필요없음
export default function* rootSaga() {
	// all 은 배열을 받음, 함수를 동시에 다 실행
  // fork 함수를 실행
  yield all([
    fork(postSaga),
    fork(userSaga),
  ]);
}
