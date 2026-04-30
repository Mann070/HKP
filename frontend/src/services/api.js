// Mock API Service using localStorage for demonstration without a backend
const getStorageData = (key) => JSON.parse(localStorage.getItem(key) || '[]');
const setStorageData = (key, data) => localStorage.setItem(key, JSON.stringify(data));

// Initial data if storage is empty
const initData = () => {
  if (!localStorage.getItem('hkp_categories')) {
    const initialCategories = [
      { _id: '1', name: 'Feeding Bottle', icon: 'bottle' },
      { _id: '2', name: 'Baby Food Container', icon: 'box' },
      { _id: '3', name: 'Soft Toys', icon: 'smile' },
      { _id: '4', name: 'Bath Towels', icon: 'waves' },
      { _id: '5', name: 'Silicon Spoons', icon: 'utensils' },
      { _id: '6', name: 'Baby Gift Sets', icon: 'gift' }
    ];
    setStorageData('hkp_categories', initialCategories);
  }
};

initData();

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

export const getCategories = async () => {
  await delay(300);
  return { data: getStorageData('hkp_categories') };
};

export const addCategory = async (data) => {
  await delay(500);
  const categories = getStorageData('hkp_categories');
  const newCategory = { ...data, _id: Date.now().toString() };
  categories.push(newCategory);
  setStorageData('hkp_categories', categories);
  return { data: newCategory };
};

export const deleteCategory = async (id) => {
  await delay(500);
  const categories = getStorageData('hkp_categories');
  const filtered = categories.filter(c => c._id !== id);
  setStorageData('hkp_categories', filtered);
  // Also delete associated images
  const images = getStorageData('hkp_images');
  const filteredImages = images.filter(img => img.categoryId !== id);
  setStorageData('hkp_images', filteredImages);
  return { data: { success: true } };
};

export const getImages = async (categoryId) => {
  await delay(300);
  const images = getStorageData('hkp_images');
  return { data: images.filter(img => img.categoryId === categoryId) };
};

export const uploadImages = async (formData) => {
  await delay(1000);
  const categoryId = formData.get('categoryId');
  const files = formData.getAll('images');
  const images = getStorageData('hkp_images');
  
  const newImages = await Promise.all(files.map(async (file) => {
    const reader = new FileReader();
    const base64 = await new Promise((resolve) => {
      reader.onload = () => resolve(reader.result);
      reader.readAsDataURL(file);
    });
    
    return {
      _id: Math.random().toString(36).substr(2, 9),
      imageUrl: base64,
      categoryId
    };
  }));
  
  const updatedImages = [...images, ...newImages];
  setStorageData('hkp_images', updatedImages);
  return { data: newImages };
};

export const deleteImage = async (id) => {
  await delay(300);
  const images = getStorageData('hkp_images');
  const filtered = images.filter(img => img._id !== id);
  setStorageData('hkp_images', filtered);
  return { data: { success: true } };
};

export const deleteImagesBulk = async ({ ids }) => {
  await delay(500);
  const images = getStorageData('hkp_images');
  const filtered = images.filter(img => !ids.includes(img._id));
  setStorageData('hkp_images', filtered);
  return { data: { success: true } };
};

const api = {
  getCategories,
  addCategory,
  deleteCategory,
  getImages,
  uploadImages,
  deleteImage,
  deleteImagesBulk
};

export default api;
