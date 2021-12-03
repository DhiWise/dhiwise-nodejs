/* eslint-disable implicit-arrow-linebreak */
import { apiClient } from './config';
import { API_URLS } from './constants';

export const createNewApplication = (appData) => apiClient(API_URLS.application.create, appData, 'POST', {}, {}, { isErrorResponse: true });

export const editApplication = (id, payload) => apiClient(`${API_URLS.application.edit}/${id}`, payload, 'PUT');

export const redirectApplication = () => apiClient(`${API_URLS.application.lastAppRedirect}`, {}, 'GET');

export const destroyApplication = (payload) => apiClient(`${API_URLS.application.destroy}`, payload);
