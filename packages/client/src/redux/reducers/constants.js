/* eslint-disable no-param-reassign */
import { createSlice } from '@reduxjs/toolkit';
import { cloneDeep, sortBy } from 'lodash';
import { listConstants } from '../thunks/constants';

const sortConstantList = (constantList) => sortBy(constantList, ['fileName']);

const initialState = { constantList: [], currentId: null, listConstantFetching: false };
const constants = createSlice({
  name: 'constants',
  initialState,
  reducers: {
    addConstant: {
      reducer: (state, { payload }) => {
        const tempConstants = cloneDeep(state.constantList);
        tempConstants.unshift(payload);
        state.constantList = sortConstantList(tempConstants);
        state.currentId = payload._id;
      },
    },
    setCurrentConstant: (state, { payload }) => {
      state.currentId = payload;
    },

    deleteCurrentConstant: (state) => {
      state.constantList = state.constantList.filter((constant) => constant._id !== state.currentId);
      state.currentId = state.constantList?.[0]?._id || null;
    },
    updateCurrentConstant: function updateConstant(state, { payload }) {
      const tempConstants = state.constantList.map((constant) => {
        if (payload._id === constant._id) {
          return payload;
        }
        return constant;
      });
      state.constantList = sortConstantList(tempConstants);
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(listConstants.fulfilled, (state, { payload }) => {
        state.listConstantFetching = false;
        state.constantList = payload?.data?.list ? sortConstantList(payload.data.list) : [];
        state.currentId = state.constantList[0]?._id;
      })
      .addCase(listConstants.pending, (state) => {
        state.listConstantFetching = true;
      });
  },
});

const { reducer, actions } = constants;
export const {
  addConstant, setCurrentConstant, deleteCurrentConstant, updateCurrentConstant,
} = actions;
export default reducer;
