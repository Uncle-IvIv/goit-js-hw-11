import './css/styles.css';
import { fetchImages } from './js/pixabay-api.js';
import { renderGallery } from './js/render-functions.js';

const form = document.querySelector('.search-form');
const gallery = document.querySelector('.gallery');

form.addEventListener('submit', async (event) => {
  event.preventDefault();
  const query = event.currentTarget.elements.searchQuery.value.trim();
  
  if (!query) return;

  try {
    const data = await fetchImages(query);
    if (data.hits.length === 0) {
      alert('Зображень не знайдено!');
      return;
    }
    renderGallery(data.hits, gallery);
  } catch (error) {
    alert('Щось пішло не так при завантаженні даних.');
  }
});