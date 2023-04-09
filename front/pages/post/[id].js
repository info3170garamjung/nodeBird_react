import React from 'react';
import { useSelector } from 'react-redux';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { END } from 'redux-saga';

import axios from 'axios';
import { LOAD_POST_REQUEST } from '../../reducers/post';
import wrapper from '../../store/configureStore';
import PostCard from '../../components/PostCard';
import AppLayout from '../../components/AppLayout';
import { LOAD_MY_INFO_REQUEST } from '../../reducers/user';

const Post = () => {
  const { singlePost } = useSelector((state) => state.post);
  const router = useRouter();
  const { id } = router.query; // id를 사용해서 게시글을 라우팅

  // fallback이 true, path에 현재 경로가 없으면, 해당하는 아이디를 서버로 부터 불러옴
  // if (router.isFallback) {
  //   return <div>Loading...</div>
  // }

  return (
    <AppLayout>
      <Head>
        <title>
          {singlePost.User.nickname}
          님의 글
        </title>
        <meta name="description" content={singlePost.content} />
        <meta property="og:title" content={`${singlePost.User.nickname}님의 게시글`} /> 
        <meta property="og:description" content={singlePost.content} />
        <meta property="og:image" content={singlePost.Images[0] ? singlePost.Images[0].src : 'https://nodebird.com/favicon.ico'} />
        <meta property="og:url" content={`https://nodebird.com/post/${id}`} />
      </Head>
      <PostCard post={singlePost} />
    </AppLayout>
  );
};

// export async function getStaticPaths() {
// axios로 post의 전체 아이디,리스트 등을 가져와서 다 넣어줄수있음
// const result = await axios.get('/post/list')
  // return {
   //  paths: [
      // 1번게시글이 미리 build 된다.
     //  { params: { id: '1' } },
     //  { params: { id: '2' } },
     //  { params: { id: '3' } },
     //  { params: { id: '4' } },
    // ],
   //  fallback: true,
  // };
// }

// getServerSideProps, getStaticProps 안에서는 context.params.id / context.query.id 하면 useRouter 에 접근 가능 
export const getServerSideProps = wrapper.getServerSideProps((store) => async ({ req, params }) => {
  const cookie = req ? req.headers.cookie : '';
  //console.log(context);
  axios.defaults.headers.Cookie = '';
  if (req && cookie) {
    axios.defaults.headers.Cookie = cookie;
  }
  store.dispatch({
    type: LOAD_MY_INFO_REQUEST,
  });
  store.dispatch({  // 단일 게시글 불러오는 액션
    type: LOAD_POST_REQUEST,
    data: params.id,
  });
  store.dispatch(END);
  await store.sagaTask.toPromise();
});

export default Post;