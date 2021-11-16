import { createAsyncThunk } from '@reduxjs/toolkit';
import { API_URLS, apiClient } from '../../api';
import { getModel } from '../../api/models';

export const listModels = createAsyncThunk(
  'model/paginate',
  // eslint-disable-next-line no-return-await
  async (data) => await apiClient(API_URLS.schema.paginate, data),
);

export const getModelDetail = createAsyncThunk(
  '',
  // eslint-disable-next-line no-return-await
  async (data) => await getModel(data),
);
