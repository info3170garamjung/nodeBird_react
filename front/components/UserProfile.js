import React, {useCallback} from 'react';
import { Card, Avatar, Button } from 'antd';
import { useDispatch, useSelector } from 'react-redux';
// 로그아웃 눌렀을때 로그아웃이 풀리게만들고 싶으면 매개변수 setIsLoggedIn 받아오고 onLogOut 만들어줌
// setIsLoggedIn은 AppLayout파일에서 <UserProfile setIsLoggedIn={setIsLoggedIn} /> 를 추가해준다.
import { logoutRequestAction } from '../reducers/user';
import Link from 'next/link';

const UserProfile = () => {
  const dispatch = useDispatch();
  const { me, logOutLoading } = useSelector((state) => state.user); // 실제 me 라는 데이터를 사용할수 있음

  const onLogOut = useCallback(() => {
    dispatch(logoutRequestAction());
  }, []);

  return (
    <>
    {/* react에서 배열로 jsx쓸때는 key를 붙여줘야한다. */}
    <Card
      actions={[
        <div key="twit"><Link href={`/user/${me.id}`}><a>짹짹<br />{me.Posts.length}</a></Link></div>,
        <div key="followings"><Link href="/profile"><a>팔로잉<br />{me.Followings.length}</a></Link></div>,
        <div key="followings"><Link href="/profile"><a>팔로워<br />{me.Followers.length}</a></Link></div>,
      ]}
    >
      <Card.Meta 
       // avatar={<Avatar>{me.nickname[0]}</Avatar>}
       avatar={(
        <Link href={`/user/${me.id}`}>
          <a><Avatar>{me.nickname[0]}</Avatar></a>
        </Link>
           )}
        title={me.nickname}
      />
      <Button onClick={onLogOut} loading={logOutLoading}>로그아웃</Button>
    </Card>
    </>
  );
}

export default UserProfile;