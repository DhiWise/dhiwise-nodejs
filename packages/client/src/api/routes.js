import { apiClient } from './config';
import { API_URLS } from './constants';

export const createNodeRoute = (payload) => apiClient(API_URLS.route.create, payload);
export const updateNodeRoute = (routeId, payload) => apiClient(`${API_URLS.route.url}/${routeId}`, payload, 'PUT');
export const getModelRoutes = (payload) => apiClient(API_URLS.route.paginate, payload);
export const deleteModelRoute = (payload) => apiClient(API_URLS.route.delete, payload);
