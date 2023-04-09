import { Button, Card, List } from 'antd';
import { StopOutlined } from '@ant-design/icons';
import React from 'react';
import PropTypes from 'prop-types';
import { useDispatch } from 'react-redux';
import { UNFOLLOW_REQUEST, REMOVE_FOLLOWER_REQUEST  } from '../reducers/user';

const FollowList = ({ header, data, onClickMore, loading }) => {
  const dispatch = useDispatch();
  const onCancel = (id) => () => {
    if (header === '팔로잉') {
    dispatch({
      type: UNFOLLOW_REQUEST, // 언팔로우
      data: id,
    });
  }
  dispatch({ // header === '팔로워'
    type:REMOVE_FOLLOWER_REQUEST, // 팔로워차단 (팔로워제거)
    data: id,
  })

};

  return(
  <List
    style={{ marginBottom: '20px' }}
    grid={{ gutter: 4, xs: 2, md: 3 }}
    size="small"
    header={<div>{header}</div>}
    loadMore={<div style={{ textAlign: 'center', margin: '10px 0'}}>
        <Button onClick={onClickMore} loading={loading}>더 보기</Button>
    </div>}
    bordered
    dataSource={data}
            /*반복문 안에서 아이템의 정보를 보내고싶을떄 고차함수 사용 */
            /*반복문에대한 데이터 onClick 으로 넘겨주기 */
    renderItem={(item) => (
      <List.Item style={{ marginTop: '20px' }}>
        <Card actions={[<StopOutlined key="stop" onClick={onCancel(item.id)} />]}> 
          <Card.Meta description={item.nickname} />
        </Card>
      </List.Item>
    )}
  />
  );
    };

FollowList.propTypes = {
  header: PropTypes.string.isRequired,
  data: PropTypes.array.isRequired,
  onClickMore: PropTypes.func.isRequired,
  loading: PropTypes.bool.isRequired,
};

export default FollowList;
