import { apiClient } from '.';
import { API_URLS } from './constants';

export const getModelPermissions = (payload) => apiClient(API_URLS.schemaDetail.paginate, payload);
export const upsertModelPermissions = (payload) => apiClient(API_URLS.schemaDetail.upsert, payload);
export const deleteModel = (payload) => apiClient(API_URLS.schema.delete, payload);
export const createModel = (payload) => apiClient(API_URLS.schema.create, payload);
export const updateModelApi = (payload, id) => apiClient(`${API_URLS.schema.update}/${id}`, payload, 'PUT');

// Library Model
export const createMultipleModels = (payload) => apiClient(`${API_URLS.schema.multipleCreate}`, payload);

// get specific Model Detail
export const getModel = (id) => apiClient(`${API_URLS.schema.get}/${id}`, null, 'GET');
