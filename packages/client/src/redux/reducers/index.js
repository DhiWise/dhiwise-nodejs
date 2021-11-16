import { combineReducers } from '@reduxjs/toolkit';
import models from './models';
import projects from './projects';
import constants from './constants';
import policy from './policy';
import buildCode from './buildCode';

export default combineReducers({
  models,
  projects,
  constants,
  policy,
  buildCode,
});
