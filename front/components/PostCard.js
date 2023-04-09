// components > PostCard.js
// 컴포넌트를 만들때, 구현을 세부적으로 하기보다 대충 어떤식으로 구현할지 그려보기
// 그 후에 실제로 하나씩 구현해나가기
import React, { useEffect, useState, useCallback } from 'react';
import { Card, Button, Avatar, Popover, List } from 'antd';
import PropTypes from 'prop-types';
import { RetweetOutlined, HeartTwoTone, HeartOutlined, MessageOutlined, EllipsisOutlined } from '@ant-design/icons';
import { useSelector, useDispatch } from 'react-redux';
import Link from 'next/link';

import CommentForm from './CommentForm';
import PostImages from './PostImages';
import FollowButton from './FollowButton';
import PostCardContent from './PostCardContent';
import { REMOVE_POST_REQUEST, LIKE_POST_REQUEST, UNLIKE_POST_REQUEST, RETWEET_REQUEST } from '../reducers/post';

import moment from 'moment';

moment.locale('ko'); // 한글로 바꿔주기

// pages > index.js parent에서 post를 props로 받아옴 
const PostCard = ({ post }) => {
  const dispatch = useDispatch();
  const { removePostLoading } = useSelector((state) => state.post);
const [commentFormOpened, setCommentFormOpened] = useState(false);
const id = useSelector((state) => state.user.me && state.user.me.id);

// const [liked, setLiked] = useState(false);

// optional chaining 연산자 -> me.id가 있으면 변수에 저장되고 아니면 undifined로 바꿔줌
// const id = me?.id?

/*
// true -> false || false -> true
const onToggleLike = useCallback(() => {
    setLiked((prev) => !prev);
  }, []);
*/
/*
useEffect(() => {
  if (retweetError) {
    alert(retweetError);
  }
}, [retweetError])
*/
const onLike = useCallback(() => {
  if (!id) {
    return alert('로그인이 필요합니다.');
  }
  return dispatch({
    type: LIKE_POST_REQUEST,
    data: post.id, // 게시글아이디
  });
}, [id]);

const onUnlike = useCallback(() => {
  if (!id) {
    return alert('로그인이 필요합니다.');
  }
  return dispatch({
    type: UNLIKE_POST_REQUEST,
    data: post.id,
  });
}, [id]);

  const onToggleComment = useCallback(() => {
    setCommentFormOpened((prev) => !prev);
  }, []);

  const onRemovePost = useCallback(() => {
    if (!id) { // 로그인이 안한 사용자는 프론트 부터 막아줌
      return alert('로그인이 필요합니다.');
    }
    return dispatch({
      type: REMOVE_POST_REQUEST,
      data: post.id,
    });
  }, [id]);

  const onRetweet = useCallback(() => {
    if (!id) { // 로그인이 안한 사용자는 프론트 부터 막아줌 (요청이 안가게)
      return alert('로그인이 필요합니다.');
    }
    return dispatch({
      type: RETWEET_REQUEST,
      data: post.id,
    });
  }, [id]);


// 줄여서 state.user.me?.id
// const id = useSelector((state) => state.user.me?.id);
  const liked = post.Likers.find((v) => v.id === id); // 게시글 좋아요 누른 사람중에 내가 있는지
	return (
		<div style={{ marginBottom: 20 }}>
			{/*antDesign Card 속성확인*/}
			<Card
				cover={post.Images[0] && <PostImages images={post.Images} />}
				actions={[
          <RetweetOutlined key="retweet" onClick={onRetweet}/>, 
          liked
            ? <HeartTwoTone twoToneColor="#eb2f96" key="heart" onClick={onUnlike} />
            : <HeartOutlined key="heart" onClick={onLike} />,
          <MessageOutlined key="message" onClick={onToggleComment} />,
					<Popover
            key="ellipsis"
            content={(
              <Button.Group>
								{/* 내가쓴글만 수정,삭제 가능 / 나를제외한 유저가 신고 가능 (조건문) */}
                {/* 내 아이디 && 게시글작성자 아이디가 내 아이디와 같으면*/}
								{id && post.User.id === id
                  ? (
                    <>
                      <Button>수정</Button>
                      <Button type="danger" loading={removePostLoading} onClick={onRemovePost}>삭제</Button>
                    </>
                  )
                  : <Button>신고</Button>}
              </Button.Group>
            )}
          >
            <EllipsisOutlined />
          </Popover>,
        ]}
        //extra={<FollowButton post={post} />}
        title={post.RetweetId ? `${post.User.nickname}님이 리트윗하셨습니다.` : null}
        extra={id && <FollowButton post={post} />} 
      >

        {post.RetweetId && post.Retweet
          ? (
            <Card
              cover={post.Retweet.Images[0] && <PostImages images={post.Retweet.Images} />}
            >
               <div style={{ float: 'right' }}>{moment(post.createdAt).format('YYYY.MM.DD')}</div>
              <Card.Meta
              //  avatar={<Avatar>{post.Retweet.User.nickname[0]}</Avatar>}
              avatar={(
                <Link href={`/user/${post.Retweet.User.id}`} >
                  <a><Avatar>{post.Retweet.User.nickname[0]}</Avatar></a>
                </Link>
              )}
                title={post.Retweet.User.nickname}
                description={<PostCardContent postData={post.Retweet.content} />}
              />
            </Card>
          )
          : (
            <>
            <div style={{ float: 'right' }}>{moment(post.createdAt).format('YYYY.MM.DD')}</div>
            <Card.Meta
           // avatar={<Avatar>{post.User.nickname[0]}</Avatar>}
            avatar={(
              <Link href={`/user/${post.User.id}`} >
                <a><Avatar>{post.User.nickname[0]}</Avatar></a>
              </Link>
            )}
              title={post.User.nickname}
              description={<PostCardContent postData={post.content} />}
            />
            </>
          )}

      {/*
				<Card.Meta
          avatar={<Avatar>{post.User.nickname[0]}</Avatar>}
          title={post.User.nickname}
          description={<PostCardContent postData={post.content} />}  // 특수한 기능을 처리, 따로 컴포넌트로 뺴주기
        />
        */}
      </Card>
          

			{commentFormOpened && (
        <>
          {/* CommentForm에 post 넘겨주기 */}
          {/* 댓글을 작성할떄 댓글은 게시글에 속해있음, 어떤 게시글에 댓글을 달것인지 정보가 필요(게시글의 id가 필요) */}
            <CommentForm post={post} />
            <List 
              header={`${post.Comments.length} 댓글`}
              itemLayout="horizontal"
              dataSource={post.Comments}
              renderItem={(item) => ( // post.comments가 각각 item으로 들어감
              <List.Item>
              <List.Item.Meta
                title={<div>{item.User.nickname}</div>}
               // avatar={<Avatar>{item.User.nickname[0]}</Avatar>}
               avatar={(
                <Link href={`/user/${item.User.id}`} >
                  <a><Avatar>{item.User.nickname[0]}</Avatar></a>
                </Link>
              )}
                description={item.content}
              />
            </List.Item>
              )}
            />
         </>
         )}

		</div>
  );
  };

// post: PropTypes.object.isRequired
// 위에코드를 써줘도되지만 더 자세하게 속성을 표기하고싶을떄 shape를 사용
PostCard.propTypes = {
  post: PropTypes.shape({
    id: PropTypes.number,
    User: PropTypes.object,
    content: PropTypes.string,
    createdAt: PropTypes.string,
    Comments: PropTypes.arrayOf(PropTypes.any),
    Images: PropTypes.arrayOf(PropTypes.any),
    Likers: PropTypes.arrayOf(PropTypes.object),
    RetweetId: PropTypes.number,
    Retweet: PropTypes.objectOf(PropTypes.any),
  }),
};

export default PostCard;