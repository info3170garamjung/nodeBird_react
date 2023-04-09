import React, { useCallback, useEffect } from 'react';
import { Form, Input, Button } from 'antd';
import Link from 'next/link';
import useInput from '../hooks/useInput';
// import styled from 'styled-components';
import { useDispatch, useSelector } from 'react-redux';
import { loginRequestAction } from '../reducers/user';
// useCallback 은 함수를 캐싱, useMemo 는 값을 캐싱
// setIsLoggedIn 은 AppLayout에서 옴
// redux를 생성하였기때문에, props 로 받지 않음
const LoginForm = () => {
  // action을 dispatch하기
  const dispatch = useDispatch();
  const { logInLoading, logInError } = useSelector((state) => state.user);
  const [email, onChangeEmail] = useInput('');
  const [password, onChangePassword] = useInput('');
  // custom hooks를 사용해서 이런식으로 줄일수 있음
  /*
  const [id, setId] = useState('');
  */
// 컴포넌트에 props로 넘겨주는 함수는 useCallback을 써야 최적화가됨!
/* 
const onChangeId = useCallback((e) => {
      setId(e.target.value);
  }, []);
  */

  useEffect(() => {
    if (logInError) {
      alert(logInError);
    }
  }, [logInError])

  const onSubmitForm = useCallback(() => {
    console.log(email, password);
    dispatch(loginRequestAction(
      { email, password }
    ));
  }, [email, password])

  //hook을 쓸수있는 조건 : 반복문, 조건문, 함수 안에서는 안되고 컴포넌트안에서만 가능

  // styled-component 를 사용하기 싫으면 useMemo를 사용할수있다.
  // 이렇게 사용하면 리렌더링되도 같은 개체가 유지됨
  // 그리고 태그안에 style={style} 이런식으로 적어줌
  // const style = useMemo(() => ({ marginTop: 10 }), []); 


  // virtual dom 리렌더링될떄 현재와 과거를 비교해서 달라진 부분만 다시 그려줌
  return(
   // {/* submit이되면 onFinish가 호출됨 */}
   // onFinish는 자동으로 e.preventDefault가 적용디 되어있음 (entdesign no)

    <>
    <Form onFinish={onSubmitForm} style={{ padding: '10px' }} >
      <div>
        <label htmlFor="user-email">이메일</label>
        <br />
        <Input name="user-email" type="email" value={email} onChange={onChangeEmail} required/>
      </div>
      <div>
        <label htmlFor="user-password">비밀번호</label>
        <br />
        <Input name="user-password" type="password" value={password} onChange={onChangePassword} required />
      </div>
      {/* 리렌더링 이해하기 편, style에 객체 넣으면 안된다? 리렌더링될떄마다 함수가 실행되는데 객체 새로 생성되면 다른걸로 인식되기때문에 이부분이 리렌더링됨*/}
      {/* style에 객체를 안넣어주기위해서 styled-component를 사용 */}
      {/* ButtonWapper 와 같은 스타일이 적용된 컴포넌트 만들어주기 */}
      {/* return 위에 */}
      {/* const ButtonWrapper = styled.div`margin-top:10px;`; */}
      <div style={{marginTop: '10px'}}>
      
      {/* button에다가 htmlType = submit을 붙여줘야 form이 submit이 됨, 그리고 form에서 onFinish가 호출됨 */}
        <Button type="primary" htmlType="submit" loading={logInLoading}>로그인</Button>
        <Link href="/signup"><a><Button>회원가입</Button></a></Link>
      </div>
      <div>

      </div>
    </Form>
    </>
  )
};
/*
LoginForm.propTypes = {
  setIsLoggedIn: PropTypes.func.isRequired,
}
*/

export default LoginForm;
