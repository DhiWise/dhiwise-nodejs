import { apiClient } from './config';
import { API_URLS } from './constants';

export const fetchByCode = (payload) => apiClient(API_URLS.master.getByCode, payload);
