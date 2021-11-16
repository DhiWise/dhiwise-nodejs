import { apiClient } from './config';
import { API_URLS } from './constants';

export const getProjectRoleAccess = (payload) => apiClient(API_URLS.projectRoleAccess.paginate, payload);
export const upsertProjectRoleAccess = (payload) => apiClient(API_URLS.projectRoleAccess.upsert, payload);
export const deleteProjectRoleAccess = (payload) => apiClient(API_URLS.projectRoleAccess.delete, payload);
