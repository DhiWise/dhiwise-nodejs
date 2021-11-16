import { createAsyncThunk } from '@reduxjs/toolkit';
import { fetchPolicy } from '../../api/applicationPolicy';

export const listPolicy = createAsyncThunk(
  'policy/pagination',
  // eslint-disable-next-line no-return-await
  async (data) => await fetchPolicy(data),
);
