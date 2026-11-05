import { apiGET, apiPOST } from '../fetchMethods.js';

const API_BASEURL = (process.env.REACT_APP_API_URL || 'http://localhost:4000') + '/auth';

const login = (body) => apiPOST(API_BASEURL + '/login', body);
const registro = (body) => apiPOST(API_BASEURL + '/register', body);
const getMe = () => apiGET(API_BASEURL + '/me');

export { login, registro, getMe };
