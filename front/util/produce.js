/*
import { enableES5, produce } from 'immer';

const produceExtended = (...args) => {
  enableES5();
  return produce(...args);
};
export default produceExtended;
*/
import { enableES5, produce } from 'immer';

export default (...args) => {
  enableES5();
  return produce(...args);
};

