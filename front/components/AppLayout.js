// next 에는 react hot loader 기능이 탑재되어있다.
// 코드 깔끔하게 하기 위해 eslint를 설치
// 여러 사람이 코딩을 해도 하나로 통일해준다.
// eslint-plugin-import -D
// eslint-plugin-react -D 
// eslint-plugin-react-hooks -D
import React, {useCallback} from 'react';
import PropTypes from 'prop-types';
// 링크 컴포넌트
import Link from 'next/link';
import Router, { useRouter } from 'next/router';
// Row, Col - 반응형 그리드 만들기위해
import { Menu, Input, Row, Col } from 'antd';
import LoginForm from './LoginForm';
import UserProfile from './UserProfile';
// import styled from 'styled=components';
import { useSelector } from 'react-redux';
// propTypes를 사용하려면 npm i prop-types 로 설치를 해줘야함.
// index, profile, signup이 공통적으로 사용할 layout 을 만들어줌

// next는 리액트 라우터를 쓰지않고 자체적인 라우터를 가지고 있다.
import { createGlobalStyle } from 'styled-components';
import useInput from '../hooks/useInput';
const Global = createGlobalStyle`
  .ant-row {
    margin-right: 0 !important;
    margin-left: 0 !important;
  }
  
  .ant-col:first-child {
      padding-left: 0 !important;
  }
  
  .ant-col:last-child {
    padding-right: 0 !important;
  }
`;

const AppLayout = ({ children }) => {
  const [searchInput, onChangeSearchInput] = useInput('');
  // 서버가 없는 상태에서 로그인을 어떻게 할까? dummy 데이터를 씀
  // 상태를 저장할수 있는 useState를 씀
  
  // isLoggedIn 더이상 필요없다. 리덕스라는 중앙관리소가 있기때문에 컴포넌트별로 isLoggedIn을 관리 하지 않아도됨
  //const [isLoggedIn, setIsLoggedIn] = useState(false);
  // const isLoggedIn = useSelector((state) => state.user.isLoggedIn);
  const { me } = useSelector(state => state.user); // 위와같이 쓸수도 있지만, user 자체를 받아와서 user안에서 isLoggedIn 을 구조분해 할당하는것도 가능
  
  const onSearch = useCallback(() => {
    Router.push(`/hashtag/${searchInput}`);
  }, [searchInput]);


  return(
    <div>
       <Global />
      {/* link component 안에 href 주소를 붙여주고 그 안에 a 태그를 넣어줌 */}
      {/* 주의할점은 a에 href적는것이 아닌 Link에 href를 적어준다 */}
      {/* 링크를 클릭하면 url / 뒤가 바뀌고, 해당 component로 간다 */}
      <Menu mode="horizontal" >
        <Menu.Item>
          <Link href="/"><a>노드버드</a></Link>
        </Menu.Item>
        <Menu.Item>
          <Link href="/profile"><a>프로필</a></Link>
        </Menu.Item>
        {/*해쉬태그 검색창, 인라인으로 css작성 가능 */} 
        <Menu.Item>
          {/* Input.Search는 어떻게 styled component로 바꿀수 있을까 */}
          {/* return 전에 */}
          {/* const SearchInput = style(Input.Search)`vertical-align: middle;` */}
          {/* 그리고 Input.Search 부분을 SearchInput 으로 대체해주면됨 */}

          {/* <Input.Search enterButton style={{ verticalAlign: 'middle' }} /> */}
          {/*
          <SearchInput
            enterButton
            value={searchInput}
            onChange={onChangeSearchInput}
            onSearch={onSearch}
          />,
  */}
         <Input.Search 
         enterButton 
         value={searchInput}
         onChange={onChangeSearchInput}
         onSearch={onSearch}
         style={{ verticalAlign: 'middle' }} /> 

        </Menu.Item>
        {/*
        <Menu.Item>
          <Link href="/signup"><a>회원가입</a></Link>
        </Menu.Item>
*/}
      </Menu>
      {/* 나눌때 가로먼저 그다음에 세로 */}
      {/* 컬럼사이에 간격을 주는것이 gutter */}
      <Row gutter={8}>
        {/* 모바일일떄는 24칸을 차지하여 화면을 100% 사용 */}
        {/* 모바일일 경우 100% / 100% / 100% 스택처럼 쌓여있음 */}
        {/* 화면을 넓히면 25% 50% 25% 가로로 배치, 반응형으로 구성 */}
        {/* 로그인되어있으면 사용자 프로필을 보여줄꺼고 안되어있으면 loginform 을 보여줄꺼임 */}
        {/* LoginForm에서 setIsLoggedIn true를 하는순간(submitform을 클릭하는순간) AppLayout의 isLoggedIn이 true로 바뀌어서 컴포넌트 UserProfile로 이동 , 서버가 없어도 가상의 스테이트들로..만들어줌 */}
{/*
<Col xs={24} md={6}>
{isLoggedIn ? <UserProfile setIsLoggedIn={setIsLoggedIn} /> : 
<LoginForm setIsLoggedIn={setIsLoggedIn}/>}</Col>
*/}
{/* 데이터가 흩어져있지않고 한곳에 모여있기떄문에 props가 필요없음 */}
        <Col xs={24} md={6}>{me ? <UserProfile /> : <LoginForm />}</Col>
        <Col xs={24} md={12}>{children}</Col>
        <Col xs={24} md={6}><a href="https://www.google.com" target="_blank" rel="noreferrer noopener">Made by Garam</a></Col>
      </Row>

    </div>
  )
};

AppLayout.propTypes = {
  // props로 넘기는경우 propTypes로 검사를 해주는 것이 좋음
  // return 안에 들어갈수있는 모든것들이 node
  children: PropTypes.node.isRequired,
};


export default AppLayout;