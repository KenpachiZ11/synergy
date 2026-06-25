import axios from 'axios';

const API_BASE_URL = 'http://localhost:3001';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const booksAPI = {
  getAll: () => api.get('/books'),
  getById: (id) => api.get(`/books/${id}`),
  create: (book) => api.post('/books', book),
  update: (id, book) => api.put(`/books/${id}`, book),
  delete: (id) => api.delete(`/books/${id}`),
  search: (params) => {
    const searchParams = new URLSearchParams();
    if (params.category) searchParams.append('category', params.category);
    if (params.author) searchParams.append('author_like', params.author);
    if (params.title) searchParams.append('title_like', params.title);
    return api.get(`/books?${searchParams.toString()}`);
  }
};

export const usersAPI = {
  getAll: () => api.get('/users'),
  getById: (id) => api.get(`/users/${id}`),
  create: (user) => api.post('/users', user),
  update: (id, user) => api.put(`/users/${id}`, user),
  delete: (id) => api.delete(`/users/${id}`),
  login: async (credentials) => {
    const response = await api.get(`/users?username=${credentials.username}&password=${credentials.password}`);
    return response.data[0] || null;
  }
};

export const rentalsAPI = {
  getAll: () => api.get('/rentals'),
  getByUserId: (userId) => api.get(`/rentals?userId=${userId}`),
  create: (rental) => api.post('/rentals', rental),
  update: (id, rental) => api.put(`/rentals/${id}`, rental),
  delete: (id) => api.delete(`/rentals/${id}`),
  getExpiring: () => {
    const today = new Date();
    const threeDaysFromNow = new Date(today.getTime() + (3 * 24 * 60 * 60 * 1000));
    const todayStr = today.toISOString().split('T')[0];
    const threeDaysStr = threeDaysFromNow.toISOString().split('T')[0];
    
    return api.get(`/rentals?status=active&endDate_gte=${todayStr}&endDate_lte=${threeDaysStr}`);
  }
};

export const purchasesAPI = {
  getAll: () => api.get('/purchases'),
  getByUserId: (userId) => api.get(`/purchases?userId=${userId}`),
  create: (purchase) => api.post('/purchases', purchase),
  delete: (id) => api.delete(`/purchases/${id}`)
};

export default api;
