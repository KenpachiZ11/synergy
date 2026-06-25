import axios from 'axios';

const API_BASE_URL = 'http://localhost:3001';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const authAPI = {
  login: (credentials) => api.post('/users', credentials).then(response => {
    return response;
  }),
  register: (userData) => api.post('/users', userData),
  checkUser: (username, password) => api.get(`/users?username=${username}&password=${password}`),
};

export const usersAPI = {
  getAll: () => api.get('/users'),
  getById: (id) => api.get(`/users/${id}`),
  create: (userData) => api.post('/users', userData),
  update: (id, userData) => api.put(`/users/${id}`, userData),
  delete: (id) => api.delete(`/users/${id}`),
};

export const travelsAPI = {
  getAll: () => api.get('/travels'),
  getById: (id) => api.get(`/travels/${id}`),
  getByUserId: (userId) => api.get(`/travels?userId=${userId}`),
  create: (travelData) => api.post('/travels', travelData),
  update: (id, travelData) => api.put(`/travels/${id}`, travelData),
  delete: (id) => api.delete(`/travels/${id}`),
};

export const likesAPI = {
  getAll: () => api.get('/likes'),
  getByTravelId: (travelId) => api.get(`/likes?travelId=${travelId}`),
  getByUserId: (userId) => api.get(`/likes?userId=${userId}`),
  create: (likeData) => api.post('/likes', likeData),
  delete: (id) => api.delete(`/likes/${id}`),
  deleteByUserAndTravel: (userId, travelId) => 
    api.get(`/likes?userId=${userId}&travelId=${travelId}`)
      .then(response => {
        if (response.data.length > 0) {
          return api.delete(`/likes/${response.data[0].id}`);
        }
      }),
};

export default api;
