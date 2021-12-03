/* eslint-disable no-param-reassign */
import { createSlice } from '@reduxjs/toolkit';
import { BUILD_ARCHITECTURE_CODE } from '../../constant/buildProcessConstant';
import { codeGenerator } from '../thunks/buildCode';

const initialState = {
  generatedId: '',
  isBuildLoading: false,
  buildArchitecture: BUILD_ARCHITECTURE_CODE.MVC,
  vsCodePopup: false,
  buildError: '',
  codeGeneratedPath: '',
};
const buildCode = createSlice({
  name: 'buildCode',
  initialState,
  reducers: {
    setBuildCodeState: (state, { payload }) => {
      state.buildArchitecture = payload.buildArchitecture ?? state.buildArchitecture;
      state.vsCodePopup = payload.vsCodePopup ?? state.vsCodePopup;
      state.generatedId = payload.generatedId ?? state.generatedId;
    },
    resetBuildState: (state) => {
      Object.assign(state, initialState);
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(codeGenerator.fulfilled, (state, { payload }) => {
        // If on create app page and than not set
        if (window.location.pathname.includes('node')) {
          state.isBuildLoading = false;
          state.vsCodePopup = true;
          state.generatedId = payload.data.generatedId;
          state.codeGeneratedPath = payload.data.path;
        }
      })
      .addCase(codeGenerator.pending, (state) => {
        state.isBuildLoading = true;
      })
      .addCase(codeGenerator.rejected, (state, { error }) => {
        state.isBuildLoading = false;
        state.buildError = error?.message;
        state.vsCodePopup = true;
        state.codeGeneratedPath = '';
      });
  },
});

const { reducer, actions } = buildCode;
export const {
  setBuildCodeState, resetBuildState,
} = actions;
export default reducer;
