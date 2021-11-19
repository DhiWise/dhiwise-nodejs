import { apiClient } from './config';
import { API_URLS } from './constants';

export const createApplicationConfig = (payload) => apiClient(API_URLS.applicationConfig.create, payload);
export const getApplicationConfig = (payload) => apiClient(API_URLS.applicationConfig.paginate, payload);
export const updateApplicationConfig = (applicationConfigId, payload) => apiClient(`${API_URLS.applicationConfig.url}/${applicationConfigId}`, payload, 'PUT');
