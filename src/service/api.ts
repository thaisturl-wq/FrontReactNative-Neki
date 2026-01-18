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
      console.log(`[API Request] ${config.method?.toUpperCase()} ${config.url}`);
    } catch (error) {
      console.error('Erro no interceptor de requisição:', error);
    }
    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => {
    console.log(`[API Response] ${response.status} from ${response.config.url}`);
    return response;
  },
  (error) => {
    if (error.response) {
      console.error(`[API Error] ${error.response.status} from ${error.config.url}:`, error.response.data);
      if (error.response.status === 401 || error.response.status === 403) {
        console.warn('Sessão inválida ou erro de permissão.');
        if (!error.config.url?.includes('/login')) {
          AsyncStorage.removeItem('token');
          AsyncStorage.removeItem('user_data');
        }
      }
    } else if (error.request) {
      console.error('[API Error] Sem resposta do servidor:', error.request);
    } else {
      console.error('[API Error] Erro de configuração:', error.message);
    }
    return Promise.reject(error);
  }
);

export default api;
