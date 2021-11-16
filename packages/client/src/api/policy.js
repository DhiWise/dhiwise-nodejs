import { apiClient } from '.';
import { API_URLS } from './constants';

export const createPolicy = (payload) => apiClient(API_URLS.policy.create, payload);
export const updatePolicy = (policyId, payload) => apiClient(`${API_URLS.policy.url}/${policyId}`, payload, 'PUT');
export const getPolicies = (payload) => apiClient(API_URLS.policy.paginate, payload);
export const deletePolicy = (payload) => apiClient(API_URLS.policy.delete, payload);
