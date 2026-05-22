import axios from 'axios';

const API_KEY = '55975550-00d0c24910787aa60712254b7'; 
const BASE_URL = 'https://pixabay.com/api/'; 

export async function getImagesByQuery(query) {
  const response = await axios.get(BASE_URL, {
    params: {
      key: API_KEY,
      q: query,
      image_type: 'photo',
      orientation: 'horizontal',
      safesearch: true,
    },
  });
  
  return response.data;
}