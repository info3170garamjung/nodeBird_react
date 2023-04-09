import React, { useCallback, useState, useEffect } from 'react';
import AppLayout from '../components/AppLayout';
import HEAD from 'next/head';
import Router from 'next/router';
import { Form, Input, Checkbox, Button } from 'antd';
import useInput from '../hooks/useInput';
import { LOAD_MY_INFO_REQUEST, SIGN_UP_REQUEST } from '../reducers/user';
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';
import { END } from 'redux-saga';
import wrapper from '../store/configureStore';


const Signup = () => {
    // 중복되는 부분이 많기떄문에 hooks들의 sets을 커스텀훅으로 만들어줄수 있다. 
  const dispatch = useDispatch();
  const [email, onChangeEmail ] = useInput('');
  const [ nickname, onChangeNickname ] = useInput('');
  const [ password, onChangePassword ] = useInput('');
  const [ passwordError, setPasswordError ] = useState(false);
  // setPasswordError 가 추가 되기때문에 커스텀훅으로 사용불가
  const [ passwordCheck, setPasswordCheck ] = useState('');
  const { signUpLoading, signUpDone, signUpError, me } = useSelector((state) => state.user);


  useEffect(() => {
    if (me && me.id) {
      Router.replace('/'); 
    }
  }, [me && me.id]);

  useEffect(() => { // 회원가입 완료되면 메인페이지로 돌아감
    if (signUpDone) {
      Router.replace('/');
    }
  }, [signUpDone]);

  // back > routes > user.js 에 적어준 에러메세지 -> sagas > user.js 의 err.response.data -> action.error -> signUpError
  // return res.status(403).send('이미 사용중인 아이디입니다.');
  useEffect(() => {
    if (signUpError) {
      alert(signUpError);
    }
  }, [signUpError]);
  
  const onChangePasswordCheck = useCallback((e) => {
    setPasswordCheck(e.target.value);
    setPasswordError(e.target.value !== password);
  }, [password]);

  const [termError, setTermError] = useState(false);
  const [term, setTerm] = useState(false);
  const onChangeTerm = useCallback((e) => {
    setTermError(false);
    setTerm(e.target.checked);
  }, []);
  
  // 위에서 체크 해줬지만 submit 할떄도 다시한번 체크해줌. 
  // userInput은 어려번 체크할수록 좋음
  const onSubmit = useCallback(() => {
    if (password !== passwordCheck) {
      return setPasswordError(true);
    }
    if (!term) {
      return setTermError(true);
    }
  //  console.log(password, passwordCheck, term);
    console.log(email, nickname, password);
    dispatch({
      type: SIGN_UP_REQUEST,
      data: {
        email,
        password,
        nickname,
      },
    });
  }, [email, password, passwordCheck, term]);


  return (
  <>
  <AppLayout>
  <HEAD>
    <meta charSet="utf-8" />
    <title>회원가입 | NodeBird</title>
  </HEAD>
    <Form onFinish={onSubmit}>
      <div>
        <label htmlFor="user-email">이메일</label>
        <br />
        <Input name="user-email" type="email" value={email} required onChange={onChangeEmail} />
      </div>
      <div>
        <label htmlFor="user-nick">닉네임</label>
        <br />
        <Input name="user-nick" value={nickname} required onChange={onChangeNickname} />
      </div>
      <div>
        <label htmlFor="user-password">비밀번호</label>
        <br />
        <Input name="user-password" type="password" value={password} required onChange={onChangePassword} />
      </div>
      <div>
        <label htmlFor="user-password-check">비밀번호 체크</label>
        <br />
        <Input 
        name="user-password-check" 
        type="password" 
        value={passwordCheck} 
        required 
        onChange={onChangePasswordCheck} />
         {passwordError && <div style={{ color: 'red' }}>비밀번호가 일치하지 않습니다.</div>}
      </div>
      <div>
          <Checkbox name="user-term" checked={term} onChange={onChangeTerm}>제로초 말을 잘 들을 것을 동의합니다.</Checkbox>
          {termError && <div style={{ color: 'red' }}>약관에 동의하셔야 합니다.</div>}
        </div>
        <div style={{ marginTop: 10 }}>
          {/* termError는 제출할때 true, false 결정 */}
          <Button type="primary" htmlType="submit" loading={signUpLoading}>가입하기</Button>
        </div>
    </Form>
  </AppLayout>
  </>
)
}

// 로그인여부에 따라 화면이 바뀌기떄문에 getServerSideProps 사용
export const getServerSideProps = wrapper.getServerSideProps((store) => async ({req}) => {
  console.log('getServerSideProps start');
  //console.log(req.headers);
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

export default Signup;