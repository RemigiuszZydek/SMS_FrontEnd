import axios from 'axios';
import config from '../config.js';

const Api = axios.create({
  baseURL: `${config.apiUrl}`,
  timeout: 10000,
});

const getRefreshToken = () => {
  return localStorage.getItem('refreshToken');
};

const getAccessToken = () => {
    return localStorage.getItem('accessToken');
  };

const saveTokens = (accessToken, refreshToken) => {
  localStorage.setItem('accessToken', accessToken);
  localStorage.setItem('refreshToken', refreshToken)
};

Api.interceptors.request.use(
  (config) => {
    const accessToken = getAccessToken();
    if (getAccessToken) {
      config.headers['Authorization'] = `Bearer ${accessToken}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

Api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    
    if (error.response && error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const refreshToken = getRefreshToken();
        const accessToken = getAccessToken();

        if (refreshToken, accessToken) {
          const response = await axios.post(`${config.apiUrl}auth/refresh`, { accessToken, refreshToken });

          const newAccessToken = response.data.data.accessToken;
          const newRefreshToken = response.data.data.refreshToken;

          saveTokens(newAccessToken, newRefreshToken);

          originalRequest.headers['Authorization'] = `Bearer ${newAccessToken}`;
          return axios(originalRequest);
        }
      } catch (refreshError) {
        console.error('Token refresh failed', refreshError);

        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        // Przekierować usera na logowanie (logout)
      }
    }
    return Promise.reject(error);
  }
);

export default Api;
