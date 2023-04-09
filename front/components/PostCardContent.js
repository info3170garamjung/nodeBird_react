import React from 'react';
import Link from 'next/link';
import PropTypes from 'prop-types';

const PostCardContent = ({ postData }) => ( // 첫 번째 게시글 #해시태그 #익스프레스
  <div>
    {/* 문자열 해석을 해서 해쉬태그면 해쉬태그 링크로 바꿔줌 */}
    {/* 정규표현식 사용 */}
    {/* split에서는 해쉬태그 부분을 () 감싸줘야 그부분이 포함이 됨 */}
    {postData.split(/(#[^\s#]+)/g).map((v, i) => {
      if (v.match(/(#[^\s]+)/)) {
          return <Link href={`/hashtag/${v.slice(1)}`} key={i}><a>{v}</a></Link>
      }
      return v;
    })}
  </div>
);

PostCardContent.propTypes = {
  postData: PropTypes.string.isRequired,
};

export default PostCardContent;
