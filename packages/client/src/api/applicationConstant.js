import { apiClient } from './config';
import { API_URLS } from './constants';

// Application node  Constant Services

export const createConstant = (payload) => apiClient(API_URLS.constant.create, payload);
export const updateConstant = (constantId, payload) => apiClient(`${API_URLS.constant.url}/${constantId}`, payload, 'PUT');
export const fetchConstant = (payload) => apiClient(API_URLS.constant.paginate, payload);
export const deleteConstant = (payload) => apiClient(API_URLS.constant.delete, payload);
