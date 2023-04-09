import { applyMiddleware, createStore, compose } from 'redux';
import { createWrapper } from 'next-redux-wrapper';
import { composeWithDevTools } from 'redux-devtools-extension';
import createSagaMiddleware from 'redux-saga';

import reducer from '../reducers';
import rootSaga from '../sagas';
// store > configureStore.js
// 액션이 dispatch 되는 것을 logging 하는 미들웨어 (Customizing)
/*
const loggerMiddleware = ({ dispatch, getState }) => (next) => (action) => {
  console.log(action);
	return next(action);
  }
  */

const configureStore = () => {
  //console.log(context);
  const sagaMiddleware = createSagaMiddleware();
  const middlewares = [sagaMiddleware];
  // 개발용과 배포용 미들웨어를 다르게 설정
	// history가 쌓이면 메모리도 많이 차지하고, 중앙데이터들이 어떻게 변화하는지
	// 추적이 가능하기때문에, 배포용일떄는 devtool연결 안함.
  const enhancer = process.env.NODE_ENV === 'production'
    ? compose(applyMiddleware(...middlewares))
    : composeWithDevTools(
      applyMiddleware(...middlewares),
    );

      // store : reducer, state를 포함
      // enhancer 를 추가해서 미들웨어를 설정할수 있다. (redux의 기능이 확장)
  const store = createStore(reducer, enhancer);
  store.sagaTask = sagaMiddleware.run(rootSaga);
  return store;
};
// 두번쨰는 옵션 객체
// debug가 true 일떄, 리덕스에 관해 자세한 설명이 나옴.(개발할떄는 true로 )
const wrapper = createWrapper(configureStore, { debug: process.env.NODE_ENV === 'development' });

export default wrapper;