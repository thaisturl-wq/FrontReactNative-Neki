import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform } from 'react-native';

const BASE_URL = 'http://192.168.1.3:8080';

const api = axios.create({
  baseURL: BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});
api.interceptors.request.use(
  async (config) => {
    try {
      const token = await AsyncStorage.getItem('token');
      if (token) {
        config.headers.Authorization = token.startsWith('Bearer ') ? token : `Bearer ${token}`;
      }
      //
    } catch (error) {
      //
    }
    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => {
    //
    return response;
  },
  (error) => {
    if (error.response) {
      //
      if (error.response.status === 401 || error.response.status === 403) {
        //
        if (!error.config.url?.includes('/login')) {
          AsyncStorage.removeItem('token');
          AsyncStorage.removeItem('user_data');
        }
      }
    } else if (error.request) {
      //
    } else {
      //
    }
    return Promise.reject(error);
  }
);

export default api;
