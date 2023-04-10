import React, { useState } from 'react';
import PropTypes from 'prop-types';
// 넘겨서 볼수있게 지원해주는 컴포넌트
import Slick from 'react-slick';
import { Overlay, Header, CloseBtn, SlickWrapper, ImgWrapper, Indicator, Global } from './styles';
import { backUrl } from '../../config/config';
const ImagesZoom = ({ images, onClose }) => {
  const [currentSlide, setCurrentSlide] = useState(0);

  return (
    <Overlay>
      <Global />
      <Header>
        <h1>상세 이미지</h1>
        <CloseBtn onClick={onClose} />
      </Header>
      <SlickWrapper>
        <div>
          <Slick
            initialSlide={0} // 첫번째를 어떤 이미지로 할지(인덱스)
            beforeChange={(slide, newSlide) => setCurrentSlide(newSlide)} // 현재 슬라이드가 몇인지 state로 저장해두기
            infinite // 무한반복
            arrows={false}
            slidesToShow={1} // 하나씩 보이기
            slidesToScroll={1} // 하나씩 넘기기
          >
            {images.map((v) => (
              <ImgWrapper key={v.src}>
                <img src={`${backUrl}/${v.src}`} alt={v.src} />
              </ImgWrapper>
            ))}
          </Slick>
          {/* 현재 몇번째중에 몇번째 슬라이스를 보고있는지 */}
          <Indicator> 
            <div>
              {currentSlide + 1}
              {' '}
              /
              {images.length}
            </div>
          </Indicator>
        </div>
      </SlickWrapper>
    </Overlay>
  );
};

ImagesZoom.propTypes = {
  images: PropTypes.arrayOf(PropTypes.shape({
    src: PropTypes.string,
  })).isRequired,
  onClose: PropTypes.func.isRequired,
};

export default ImagesZoom;