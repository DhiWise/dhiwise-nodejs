import { apiClient } from '.';
import { API_URLS } from './constants';

export const getEnvs = (payload) => apiClient(API_URLS.envVariables.get, payload);
export const upsertEnvs = (payload) => apiClient(API_URLS.envVariables.upsert, payload);
