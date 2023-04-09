import React, { useEffect, useState, useCallback } from 'react';
import AppLayout from '../components/AppLayout';
import HEAD from 'next/head';
import NicknameEditForm from '../components/NicknameEditForm';
import FollowList from '../components/FollowList';
import { useSelector, useDispatch } from 'react-redux';
import Router from 'next/router';
import { LOAD_MY_INFO_REQUEST, LOAD_FOLLOWERS_REQUEST, LOAD_FOLLOWINGS_REQUEST } from '../reducers/user';
import wrapper from '../store/configureStore';
import useSWR from 'swr';
import { END } from 'redux-saga';
import axios from 'axios';

const Profile = () => {
  const dispatch = useDispatch();
  const { me } = useSelector((state) => state.user);


  const fetcher = (url) => axios.get(url, { withCredentials: true }).then((result) => result.data);

  const [followersLimit, setFollowersLimit] = useState(3);
  const [followingsLimit, setFollowingsLimit] = useState(3);

  // fetcher -> url 주소를 어떻게 가져올지 적어줌
  // 구조분해 이름이 겹치기 떄문에 이름 바꿔주기
  const { data: followersData, error: followerError } = useSWR(`http://localhost:3065/user/followers?limit=${followersLimit}`, fetcher); 
  const { data: followingsData, error: followingError } = useSWR(`http://localhost:3065/user/followings?limit=${followingsLimit}`, fetcher);
// **** dispatch 부분 삭제가능

/*
  useEffect(() => { // 프로필페이지 이동시 팔로우, 팔로잉목록 부르기
    dispatch({
      type: LOAD_FOLLOWERS_REQUEST,
    });
    dispatch({
      type: LOAD_FOLLOWINGS_REQUEST,
    });
  }, []);
  */

  // 로그인 안되어있을떄 profile접근시 리다이렉트
  useEffect(() => {
    // 로그아웃 했을때
    if (!(me && me.id)) {
      Router.push('/');
    }
  }, [me && me.id]);

  const loadMoreFollowings = useCallback(() => {
    setFollowingsLimit((prev) => prev + 3);
  }, []);

  const loadMoreFollowers = useCallback(() => {
    setFollowersLimit((prev) => prev + 3);
  }, []);

  if (!me) {
    return '내 정보 로딩중...';
  }

  if (followerError || followingError) {
    console.error(followerError || followingError);
    return <div>팔로잉/팔로워 로딩 중 에러가 발생합니다.</div>;
  }
  
  return (
    
    // <div>내 프로필</div>
    
    <>
    <HEAD>
      <meta charSet="utf-8" />
      <title>내 프로필 | NodeBird</title>
    </HEAD>
    <AppLayout>
    <NicknameEditForm />
      <FollowList
        header="팔로잉"
        data={followingsData}
        onClickMore={loadMoreFollowings} loading={!followingsData && !followingError}
      />
      <FollowList
        header="팔로워"
        data={followersData}
        onClickMore={loadMoreFollowers} loading={!followersData && !followerError}
      />

    </AppLayout>
    </>
  );
};

export const getServerSideProps = wrapper.getServerSideProps((store) => async ({ req }) => {
  //console.log('getServerSideProps start');
  //console.log(context.req.headers);
  const cookie = req ? req.headers.cookie : '';
  axios.defaults.headers.Cookie = '';
  if (req && cookie) {
    axios.defaults.headers.Cookie = cookie;
  }
  store.dispatch({
    type: LOAD_MY_INFO_REQUEST,
  });
  store.dispatch(END);
  console.log('getServerSideProps end');
  await store.sagaTask.toPromise();
});

export default Profile;