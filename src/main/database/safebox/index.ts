import updateSafeBox from './updateSafeBox';
import { createSafeBox } from './createSafeBox';
import { listSafeBox } from './listSafeBox';
import getSafeBox from './getSafeBox';
import { deleteSafeBox } from './deleteSafeBox';
import insertSafeBox from './insertSafeBox';

const DBSafeBox = {
  updateSafeBox,
  createSafeBox,
  insertSafeBox,
  listSafeBox,
  getSafeBox,
  deleteSafeBox,
};

export default DBSafeBox;
