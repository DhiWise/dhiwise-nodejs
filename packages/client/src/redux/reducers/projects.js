/* eslint-disable no-param-reassign */
import { createSlice } from '@reduxjs/toolkit';
import { isEmpty } from 'lodash';
import { ORM_TYPE, DATABASE_TYPE } from '../../constant/Project/applicationStep';

const initialState = {
  currentApplicationId: null,
  currentApplicationCode: '',
  currentProjectDetail: { projectName: '', applicationList: [] },
  applicationAddedBy: '',
  isClone: false,
  projectDatabase: {},
  applicationDatabase: { ormType: ORM_TYPE.MONGOOSE, databaseType: DATABASE_TYPE.MONGODB }, // default MONGO
};
const projects = createSlice({
  name: 'projects',
  initialState,
  reducers: {
    selectCurrentApplication: (state, { payload }) => {
      state.currentApplicationId = payload.applicationId ?? state.currentApplicationId;

      state.currentApplicationCode = payload.applicationCode ?? state.currentApplicationCode;

      // Current Select application => project information and application List
      state.currentProjectDetail = {
        projectName: payload.currentProject?.name ?? state.currentProjectDetail.projectName,
        applicationList: payload.currentProject?.applications ?? state.currentProjectDetail.applicationList,
      };

      const currentApplication = state.currentProjectDetail.applicationList.find((x) => x._id === state.currentApplicationId);
      state.applicationDatabase = !isEmpty(currentApplication?.stepInput) ? currentApplication?.stepInput : initialState.applicationDatabase;
    },
  },
});

const { reducer, actions } = projects;
export const {
  selectCurrentApplication,
} = actions;
export default reducer;
