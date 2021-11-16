import { apiClient } from './config';
import { API_URLS } from './constants';

// Application node  Constant Services

export const createPolicy = (payload) => apiClient(API_URLS.policy.create, payload);
export const updatePolicy = (policyId, payload) => apiClient(`${API_URLS.policy.url}/${policyId}`, payload, 'PUT');
export const fetchPolicy = (payload) => apiClient(API_URLS.policy.paginate, payload);
export const deletePolicy = (payload) => apiClient(API_URLS.policy.delete, payload);
