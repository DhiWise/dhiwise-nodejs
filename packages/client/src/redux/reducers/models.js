/* eslint-disable no-prototype-builtins */
/* eslint-disable no-param-reassign */
import { createSlice } from '@reduxjs/toolkit';
import { sortBy, uniqBy } from 'lodash';
import { listModels, getModelDetail } from '../thunks/models';

const sortModelList = (models) => sortBy(models, 'name');

const initialState = {
  modelList: [], currentId: null, listFetching: false, editorLoader: false, detailFetching: false,
};
const models = createSlice({
  name: 'models',
  initialState,
  reducers: {
    addModel: {
      reducer: (state, { payload }) => {
        const tempModels = [...state.modelList];
        tempModels.push(payload);
        state.modelList = sortModelList(tempModels);
        state.currentId = payload._id;
      },
    },
    addMultipleModel: (state, { payload }) => {
      let tempModels = [...payload, ...state.modelList];
      tempModels = uniqBy(tempModels, '_id');
      state.modelList = sortModelList(tempModels);
      state.currentId = sortModelList(payload)?.[0]?._id || state.modelList[0]?._id;
    },
    setCurrentModel: (state, { payload }) => {
      state.currentId = payload.currentId;
      // state.editorLoader = true;
    },
    hideEditorLoader: (state) => {
      state.editorLoader = false;
    },
    setCurrentModelProperty: (state, { payload }) => {
      state.modelList = state.modelList.map((model) => {
        if (model._id === payload.modelId) {
          return {
            ...model,
            [payload.key]: payload.value,
          };
        }
        return model;
      });
    },
    deleteCurrentModel: (state, { payload }) => {
      state.modelList = state.modelList.filter((model) => model._id !== (payload?.delId || state.currentId));
      if ((payload?.delId && payload.delId === state.currentId) || !payload?.delId) { state.currentId = state.modelList?.[0]?._id || null; }
    },
    updateModel: function updateModel(state, { payload }) {
      const tempModels = state.modelList.map((model) => {
        if (payload._id === model._id) {
          return payload;
        }
        return model;
      });
      state.modelList = sortModelList(tempModels);
    },
    updateModelDependency: function updateModelDependency(state, { payload }) {
      // update model while change dependency
      const { request, response, currentModel } = payload;
      const tempModels = state.modelList.map((model) => {
        if (response._id === model._id) {
          if (request.hasOwnProperty('name')) {
            Object.keys(model.schemaJson).forEach((x) => {
              // update  schema
              if (model.schemaJson[x].ref === currentModel?.name) {
                model.schemaJson[x].ref = request.name;
              }
            });
            model.name = response.name;
            return model;
          } if (request.hasOwnProperty('description')) {
            model.description = response.description;
            return model;
          } return response;
        }
        return model;
      });
      state.modelList = sortModelList(tempModels);
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(listModels.fulfilled, (state, { payload }) => {
        state.modelList = payload?.data?.list ? sortModelList(payload.data.list) : [];
        state.currentId = state.modelList[0]?._id;
        state.listFetching = false;
      })
      .addCase(listModels.pending, (state) => {
        state.listFetching = true;
      })
      .addCase(getModelDetail.fulfilled, (state, { payload }) => {
        const index = state.modelList.findIndex((model) => model._id === payload?.data?._id);
        if (index > -1) { state.modelList[index] = payload.data; }
        state.detailFetching = false;
      })
      .addCase(getModelDetail.pending, (state) => {
        state.detailFetching = true;
      })
      .addCase(getModelDetail.rejected, (state) => {
        state.detailFetching = false;
      });
  },
});

const { reducer, actions } = models;
export const {
  hideEditorLoader, addModel, setCurrentModel, setCurrentModelProperty, deleteCurrentModel, updateModel, addMultipleModel, updateModelDependency,
} = actions;
export default reducer;
