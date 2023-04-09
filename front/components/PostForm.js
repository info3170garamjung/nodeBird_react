import React, { useRef, useCallback, useState, useEffect } from 'react';
import { Form, Input, Button } from 'antd';
import { useDispatch, useSelector } from 'react-redux';

import { ADD_POST_REQUEST,addPost, UPLOAD_IMAGES_REQUEST, REMOVE_IMAGE } from '../reducers/post';

const PostForm = () => {
  const { imagePaths, addPostDone } = useSelector(state => state.post);
  const [text, setText] = useState('');
 // const [text, onChangeText, setText] = useInput(''); // 커스텀훅 사용
  const dispatch = useDispatch();
  const imageInput = useRef();

  // imageInput.current를 통해서 input에 접근 가능
  const onClickImageUpload = useCallback(() => {
    imageInput.current.click();
  }, [imageInput.current]);

  /*
  useEffect(() => {
    if (postAdded) {
      setText('');
    }
  }, [postAdded]);
  */
  // setText('') 설정해주기
  useEffect(() => {
    if (addPostDone) {
      setText('');
    }
  }, [addPostDone]);

  const onChangeText = useCallback((e) => {
    setText(e.target.value);
  }, []);
  
/*
  const onSubmit = useCallback(() => {
    // onSubmit할떄 ADD_POST 액션이 실행됨
		// submit 할때마다 PostCard가 추가됨 (추가된 데이터를 반복문을 통해서 실제로 구현해주면됨)
    dispatch(addPost(text));
    }, [text]);
    */
    const onSubmit = useCallback(() => {
      if (!text || !text.trim()) {
        return alert('게시글을 작성하세요.');
      }
      const formData = new FormData();
      imagePaths.forEach((p) => {
        formData.append('image', p); // req.body.image 됨
      });
      formData.append('content', text); // req.body.content 됨
      return dispatch({
        type: ADD_POST_REQUEST,
        data: formData,
      });
    }, [text, imagePaths]);

    const onChangeImages = useCallback((e) => {
      console.log('images', e.target.files); // e.target.files 안에 내가 선택한 이미지의 정보가 들어있음
      const imagesFormData = new FormData(); // multipart 형식으로 서버로 보낼수 있음 *multipart 형식으로 보내야 multer에서 처리가능
      [].forEach.call(e.target.files, (f) => { // e.target.files 은 배열이 아닌 유사배열(배열모양을 띄는 객체), 
        // forEach 사용이 안되기때문에 배열에 forEach 메소드를 빌려서 사용 [].forEach.call
        imagesFormData.append('image', f) // key, value  // routes > post.js 의 upload.array('image') 이부분이 일치해야함
      });
      dispatch({
        type: UPLOAD_IMAGES_REQUEST,
        data: imagesFormData,
      })
    })

    const onRemoveImage = useCallback((index) => () => { // 고차함수 map(반복문)안에 callback함수의 데이터를 넣을수있음 
      dispatch({
        type: REMOVE_IMAGE, // 동기 액션
        data: index,
      });
    }, []);

  return (
    <Form style={{ margin: '10px 0 20px' }} encType="multipart/form-data" onFinish={onSubmit}>
      <Input.TextArea value={text} onChange={onChangeText} maxLength={140} placeholder="어떤 신기한 일이 있었나요?" />
      <div>
        {/*이미지 업로드 버튼 눌렀을떄 파일 업로드창 띄우기 */}
				{/* ref 사용하기 (실제 DOM에 접근) */}
        <input type="file" name="image" multiple hidden ref={imageInput} onChange={onChangeImages} />
        <Button onClick={onClickImageUpload}>이미지 업로드</Button>
        <Button type="primary" style={{ float: 'right' }} htmlType="submit">짹짹</Button>
      </div>
      <div>
        {imagePaths.map((v, i) => {
          return (
            <div key={v} style={{ display: 'inline-block' }}>
              <img src={`http://localhost:3065/${v}`} style={{ width: '200px' }} alt={v} />
              <div>
                <Button onClick={onRemoveImage(i)}>제거</Button>
              </div>
            </div>
          )
        })}
      </div>
    </Form>
  );
};

export default PostForm;