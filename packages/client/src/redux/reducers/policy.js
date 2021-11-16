/* eslint-disable no-param-reassign */
import { createSlice } from '@reduxjs/toolkit';
import { cloneDeep, sortBy } from 'lodash';
import { listPolicy } from '../thunks/policy';

const sortPolicyList = (policyList) => sortBy(policyList, ['fileName']);

const initialState = { policyList: [], currentId: null, listPolicyFetching: false };
const policy = createSlice({
  name: 'policy',
  initialState,
  reducers: {
    addPolicy: {
      reducer: (state, { payload }) => {
        const tempPolicies = cloneDeep(state.policyList);
        tempPolicies.unshift(payload);
        state.policyList = sortPolicyList(tempPolicies);
        state.currentId = payload._id;
      },
    },
    setCurrentPolicy: (state, { payload }) => {
      state.currentId = payload;
    },

    deleteCurrentPolicy: (state) => {
      state.policyList = state.policyList.filter((pol) => pol._id !== state.currentId);
      state.currentId = state.policyList?.[0]?._id || null;
    },
    updateCurrentPolicy: function updatePolicy(state, { payload }) {
      const tempPolicies = state.policyList.map((pol) => {
        if (payload._id === pol._id) {
          return payload;
        }
        return pol;
      });
      state.policyList = sortPolicyList(tempPolicies);
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(listPolicy.fulfilled, (state, { payload }) => {
        state.listPolicyFetching = false;
        state.policyList = payload?.data?.list ? sortPolicyList(payload.data.list) : [];
        state.currentId = state.policyList[0]?._id;
      })
      .addCase(listPolicy.pending, (state) => {
        state.listPolicyFetching = true;
      });
  },
});

const { reducer, actions } = policy;
export const {
  addPolicy, setCurrentPolicy, deleteCurrentPolicy, updateCurrentPolicy,
} = actions;
export default reducer;
