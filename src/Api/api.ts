import axios from 'axios';
import CookieManager from '@react-native-cookies/cookies';
import { API_URL } from '../constants/API_URL';

const api = axios.create({
    baseURL: API_URL,
    withCredentials: true, // Ensures cookies are sent with requests
});
// Attach the token from cookies before every request
api.interceptors.request.use(async (config) => {
    const cookies = await CookieManager.get(API_URL);
    if (cookies?.token) {
        config.headers.Authorization = `Bearer ${cookies.token.value}`;
    }
    return config;
}, (error) => {
    return Promise.reject(error);
});
export default api;