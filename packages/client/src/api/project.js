/* eslint-disable implicit-arrow-linebreak */
import { apiClient } from './config';
import { API_URLS } from './constants';

export const createNewApplication = (appData) => apiClient(API_URLS.application.create, appData, 'POST', {}, {}, { isErrorResponse: true });

export const editApplication = (id, payload) => apiClient(`${API_URLS.application.edit}/${id}`, payload, 'PUT');
