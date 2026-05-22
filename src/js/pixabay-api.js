import axios from 'axios';

const API_KEY = 'ВАШ_PIXABAY_API_KEY'; // Замініть на свій справжній ключ
const BASE_URL = 'https://pixabay.com';

export async function fetchImages(query) {
  try {
    const response = await axios.get(BASE_URL, {
      params: {
        key: API_KEY,
        q: query,
        image_type: 'photo',
        orientation: 'horizontal',
        safesearch: true,
      },
    });
    return response.data; // Axios автоматично повертає розпарсений JSON у .data
  } catch (error) {
    console.error('Помилка під час HTTP-запиту:', error);
    throw error;
  }
}