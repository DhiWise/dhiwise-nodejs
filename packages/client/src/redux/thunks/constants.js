import { createAsyncThunk } from '@reduxjs/toolkit';
import { fetchConstant } from '../../api/applicationConstant';

export const listConstants = createAsyncThunk(
  'constant/pagination',
  // eslint-disable-next-line no-return-await
  async (data) => await fetchConstant(data),
);
