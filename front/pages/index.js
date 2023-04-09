// next를 쓸때에는 react를 import 해줄 필요가없다.
// next는 pages 폴더는 무조건 이름이 pages여야 한다. next가 pages 폴더를 인식해서 여기 안에 있는 파일들을 다 개별적인 페이지 컴포넌트로 만들어준다.
// 코드스프리팅된 컴포넌트로 만들어줌.

import React, { useEffect } from 'react';
import AppLayout from '../components/AppLayout';

import { END } from 'redux-saga';
import { useSelector, useDispatch } from 'react-redux';
import PostForm from '../components/PostForm';
import PostCard from '../components/PostCard';
import { LOAD_POSTS_REQUEST } from '../reducers/post';
import { LOAD_MY_INFO_REQUEST } from '../reducers/user';
import wrapper from '../store/configureStore';
import axios from 'axios';

const Home = () => {
  const dispatch = useDispatch();
  const { me } = useSelector((state) => state.user);
  const { mainPosts, hasMorePosts, loadPostsLoading, retweetError } = useSelector((state) => state.post);


  useEffect(() => {
    if (retweetError) {
      alert(retweetError);
    }
  }, [retweetError]);

  /*
  // LOAD_POST_REQUEST 호출
  useEffect(() => {
    // 새로고침될때마다 로그인상태를 복구해주기 위해서
    dispatch({
      type: LOAD_MY_INFO_REQUEST,
    });
    dispatch({
      type: LOAD_POSTS_REQUEST,
    });
  }, []);
*/
  
  useEffect(() => {
    
    function onScroll() {
      // scrollY: 얼마나 내렸는지 clientHeight: 화면 보이는 길이 scrollHeight: 총 길이
      console.log(window.scrollY, document.documentElement.clientHeight, document.documentElement.scrollHeight-1);
      console.log('mainposts', mainPosts.length);
      // 화면을 끝까지 내렸을때, 게시글을 더 로딩하고 싶으면
      if (window.scrollY + document.documentElement.clientHeight > document.documentElement.scrollHeight-300) {
        if (hasMorePosts && !loadPostsLoading) {
          const lastId = mainPosts[mainPosts.length-1]?.id; // 마지막게시글의 아이디
          dispatch({
            type: LOAD_POSTS_REQUEST,
            lastId,
          });
        }
      }
    }
    window.addEventListener('scroll', onScroll);
    return () => {
      window.removeEventListener('scroll', onScroll);
    };
  }, [hasMorePosts, loadPostsLoading, mainPosts]);

  
/*
  useEffect(() => {
    function onScroll() {
     // console.log('scrollHeight', documentElement.scrollHeight);
        console.log('1 condition' , parseInt(window.scrollY) + document.documentElement.clientHeight);
        console.log('2 condition'  , document.documentElement.scrollHeight - 300);
      if (window.scrollY + document.documentElement.clientHeight > document.documentElement.scrollHeight - 300) {
        if (hasMorePosts && !loadPostsLoading) {
          dispatch({
            type: LOAD_POSTS_REQUEST,
            data: mainPosts[mainPosts.length - 1].id,
          });
        }
      }
    }
    window.addEventListener('scroll', onScroll);
    return () => {
      window.removeEventListener('scroll', onScroll);
    };
  }, [mainPosts, hasMorePosts, loadPostsLoading]);
*/

  return (
   // <div>Hello, Next!</div>
    // applayout만든것을 여기에 불러오기
    <AppLayout>
      {/* 묶일수 있는 단위가 있을때, 컴포넌트 이름을 정해주기 PostForm, PostCard */}
       {me && <PostForm />}
      {mainPosts.map((c) => {
        return (
          // key를 인덱스를 사용할떄 데이터가 바뀌지않고 반복문이 있을떄 사용가능, 특히 게시글이 지워질 가능성이 있는경우, 순서가 달라지거나, 추가될때도 사용하면안됨
          // key는 고유한 값이 들어가게 해야함.
          <PostCard key={c.id} post={c} />
        );
      })}
    </AppLayout>
  );
}

/*
// 이부분이 Home 보다 먼저 실행
// 실행된 결과를 reducers > index.js HYDRATE 로 보내줌 payload
export const getServerSideProps = wrapper.getServerSideProps(async (context) => {
  //console.log('getServerSideProps start');
  //console.log(context.req.headers);
  
// 데이터를 채워진 상태로 존재 
  context.store.dispatch({
    type: LOAD_MY_INFO_REQUEST,
  });
  context.store.dispatch({
    type: LOAD_POSTS_REQUEST,
  });
  // LOAD_USER_SUCCESS로 바뀔떄까지 기다려주는 장치
  context.store.dispatch(END);
  console.log('getServerSideProps end');
  // configureStore store.sagaTask  
  await context.store.sagaTask.toPromise();
});
*/
// 이부분이 Home 보다 먼저 실행
// 실행된 결과를 reducers > index.js HYDRATE 로 보내줌 payload
export const getServerSideProps = wrapper.getServerSideProps((store) => async ({req}) => {
  //console.log('getServerSideProps start');
  //console.log(context.req.headers);

  /*
  // 코드를 이렇게 짜면 로그인이 공유되는 문제가 생김
const cookie = context.req ? context.req.headers.cookie : '';
axios.defaults.headers.Cookie = cookie;
*/
  const cookie = req ? req.headers.cookie : '';  // 쿠키정보 들어있음
  // 쿠키 안써서 요청보낼때는 서버에서 공유하고있는 쿠키 제거하기
  axios.defaults.headers.Cookie = '';
  // 쿠키를 써서 요청을 보낼떄만 쿠키 넣기
  if (req && cookie) {
    axios.defaults.headers.Cookie = cookie;
  }

// 데이터를 채워진 상태로 존재 
  store.dispatch({
    type: LOAD_MY_INFO_REQUEST,
  });
  store.dispatch({
    type: LOAD_POSTS_REQUEST,
  });
  // LOAD_USER_SUCCESS로 바뀔떄까지 기다려주는 장치
  store.dispatch(END);
  console.log('getServerSideProps end');
  // configureStore store.sagaTask  
  await store.sagaTask.toPromise();
});


export default Home;