// 리덕스 서버사이드 렌더링을 위해서 HYDRATE를 사용
import { HYDRATE } from 'next-redux-wrapper';
import { combineReducers } from 'redux';

import user from './user';
import post from './post';

/*
//reducer : switch가 들어있는 함수
// combineReducers : reducer 합쳐주는 메서드 (함수들 끼리 합치기는 힘들어서 이 메서드 사용)
// post reducer, user reducer를 combineReducers를 사용해서 합쳐주기 initialState모양 그대로
const rootReducer = combineReducers({
  // HYDRATE를 사용하기위해서 index를 넣어주고 index reducer를 추가해준다.
  // SSR을 위해 index 추가
  index: (state = {}, action) => {
    switch (action.type) {
      case HYDRATE:
        console.log('HYDRATE', action);
        return { ...state, ...action.payload };
      default:
        return state;
    }
  },
  user, // userInitialState
  post, // postInitialState
});
*/

// index, user, post 자체를 덮어씌울수있도록 구조를 바꿔주기
const rootReducer = (state, action) => {
  switch (action.type) {
    // HYDRATE 를 사용하여 rootReducer의 상태 전체를 덮어씌우기
    case HYDRATE:
      console.log('HYDRATE', action);
      return action.payload;
    default: {
      const combinedReducer = combineReducers({
        user,
        post,
      });
      return combinedReducer(state, action);
    }
  }
};

export default rootReducer;