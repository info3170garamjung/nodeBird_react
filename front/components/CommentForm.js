import { Button, Form, Input } from 'antd';
import React, { useCallback, useEffect } from 'react';
import PropTypes from 'prop-types';
import { useDispatch, useSelector } from 'react-redux';
import useInput from '../hooks/useInput';
import { ADD_COMMENT_REQUEST } from '../reducers/post';
const CommentForm = ({ post }) => {
  /*
  const id = useSelector((state) => state.user.me?.id);
  const [commentText, onChangeCommentText] = useInput("");
  const onSubmitComment = useCallback(() => {
    console.log(post.id, commentText);
  }, [post, commentText ]);
*/

const dispatch = useDispatch();
const { addCommentDone, addCommentLoading } = useSelector((state) => state.post);
const id = useSelector((state) => state.user.me?.id);
const [commentText, onChangeCommentText, setCommentText] = useInput('');

//comment 작성후 글자 비워주기
useEffect(() => {
  if (addCommentDone) {
    setCommentText('');
  }
}, [addCommentDone]);



// 동적 액션크리에이터, dispatch안에 변수를 적어서 생성할지 결정
const onSubmitComment = useCallback(() => {
  dispatch({
    type: ADD_COMMENT_REQUEST,
    data: { content: commentText, postId: post.id, userId: id },
  });
}, [commentText, id]);

/*
const [commentText, setCommentText] = useState('');

const onSubmitComment = useCallback(() => {
  console.log(commentText);
}, [commentText]);

const onChangeCommentText = useCallback((e) => {
  setCommentText(e.target.value);
}, []);
*/

  return (
    <Form onFinish={onSubmitComment}>
      <Form.Item style={{ position: 'relative'}}>
        <Input.TextArea rows={4} value={commentText} onChange={onChangeCommentText} />
        <Button style={{ position: 'absolute', right: 0, bottom: -40, zIndex: 1 }} 
        type="primary" htmlType="submit" loading={addCommentLoading}>삐약</Button>
      </Form.Item>
    </Form>
  );
};

CommentForm.propTypes = {
  post: PropTypes.object.isRequired,
};

export default CommentForm;