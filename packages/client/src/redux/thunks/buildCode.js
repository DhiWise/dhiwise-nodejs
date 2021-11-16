import { createAsyncThunk } from '@reduxjs/toolkit';
import { apiClient, API_URLS } from '../../api';

export const codeGenerator = createAsyncThunk(
  'build/codeGeneration',
  // eslint-disable-next-line no-return-await
  async (data) => await apiClient(API_URLS.application.generate, data),
);
