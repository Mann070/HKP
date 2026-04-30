import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_URL,
});

export const getCategories = () => api.get('/categories');
export const addCategory = (data) => api.post('/categories', data);
export const deleteCategory = (id) => api.delete(`/categories/${id}`);

export const getImages = (categoryId) => api.get(`/images/${categoryId}`);
export const uploadImages = (formData) => api.post('/images', formData, {
  headers: {
    'Content-Type': 'multipart/form-data',
  },
});
export const deleteImage = (id) => api.delete(`/images/${id}`);
export const deleteImagesBulk = (data) => api.delete('/images/bulk', { data });

export default api;
