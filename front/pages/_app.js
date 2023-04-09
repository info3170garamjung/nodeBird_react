import React from 'react';
// _를 사용, 페이지들의 공통되는 것들을 처리할수 있다.
// css 적용이 안될떄,? 지
//import 'antd/dist/antd.css';
import PropTypes from 'prop-types';
// next에서 head를 수정할수 있는 HEAD 컴포넌트를 제공한다.
import HEAD from 'next/head';
import wrapper from '../store/configureStore';

const NodeBird = ( {Component} ) => {
  return (
    <>
    <HEAD>
      <meta charSet="utf-8" />
      <title>Nodebird</title>      
    </HEAD>
    {/* 모든페이지에 공통적인것은 여기에다가 적어줄수 있음 */}
    <div>공통 메뉴</div>
    <Component></Component>
    </>
  );
}

NodeBird.propTypes = {
  Component: PropTypes.elementType.isRequired,
}

// high order 컴포넌트로 감싸줌
export default wrapper.withRedux(NodeBird);