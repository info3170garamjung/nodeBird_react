import { useState, useCallback } from 'react';

// 변수명은 달라도되고 범용적으로 쓰일수 있게 바꿔주기
export default (initValue = null) => {
  const [value, setter] = useState(initValue);
  const handler = useCallback((e) => {
    setter(e.target.value);
  }, []);
  {/* value => value, handler(useCallback) */}
  return [value, handler, setter];
};