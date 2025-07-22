import axios from 'axios';
import DataHandler from '../utils/DataHandler';
import ENVConfig from '../configs/ENVConfig';
import { AppRoutes } from '../static';
import { AppLogger, Util } from '../utils';
import { clearStore } from '../reducer/auth';
import { get } from 'lodash';
import { GeneralSuccessMsg } from '../static/Constants';
import { setIsLoading } from '../reducer/general';

// Create an axios instance
const NetworkManager = axios.create({
  baseURL: ENVConfig.BaseUrl,
  headers: { 'Content-Type': 'application/json' },
  // timeout: 10000,
  // withCredentials: true,
});

// Request interceptor
NetworkManager.interceptors.request.use(
  config => {
    const { token } = DataHandler.getStoreState().auth;

    if (get(config, 'method', 'get') != 'get') {
      DataHandler.dispatchAction(setIsLoading(true));
    }

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  error => {
    AppLogger('Request Error:', error);
    DataHandler.dispatchAction(setIsLoading(false));
    return Promise.reject(error);
  }
);

// Response interceptor
NetworkManager.interceptors.response.use(
  response => {
    AppLogger('Final Response:', response);
    if (get(response, 'config.method', 'get') != 'get') {
      Util.showToast(get(response, 'data.message', GeneralSuccessMsg));
    }
    DataHandler.dispatchAction(setIsLoading(false));
    return response.data;
  },
  error => {
    if (error.response) {
      AppLogger('Response Error:', error.response);
      const status = error.response.status;
      const rawMessage =
        error.response.data?.message || error.response.data?.error;

      let message = '';
      if (Array.isArray(rawMessage)) {
        message = rawMessage.join(', ');
      } else {
        message = rawMessage || `Unexpected error occurred (status ${status})`;
      }

      Util.showToast(message, 'error');

      switch (status) {
        case 400:
          AppLogger('Bad Request:', message);
          break;
        case 401:
          // AppLogger('Unauthorized. Redirecting to login...');
          // DataHandler.dispatchAction(clearStore());
          // window.location.href = AppRoutes.Login;
          break;
        case 403:
          AppLogger('Forbidden:', message);
          break;
        case 404:
          AppLogger('Not Found:', message);
          break;
        case 500:
          AppLogger('Server Error:', message);
          break;
        default:
          AppLogger(`Unexpected Error (Status: ${status}):`, message);
      }
    } else if (error.request) {
      AppLogger('No response received from server:', error.request);
    } else {
      AppLogger('Error setting up request:', error.message);
    }
    DataHandler.dispatchAction(setIsLoading(false));
    return Promise.reject(error);
  }
);

export default NetworkManager;
