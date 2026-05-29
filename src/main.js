import iziToast from 'izitoast';
import 'izitoast/dist/css/iziToast.min.css';

import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';

import { fetchImages } from './js/pixabay-api.js';
import { createGalleryMarkup } from './js/render-functions.js';

const form = document.querySelector('#search-form');
const galleryContainer = document.querySelector('.gallery');
const loadMoreBtn = document.querySelector('#load-more');
const loader = document.querySelector('.loader');

// Глобальні змінні стану (state) для пагінації
let searchQuery = '';
let page = 1;
const perPage = 15;

// Ініціалізація SimpleLightbox
let lightbox = new SimpleLightbox('.gallery a', {
  captionsData: 'alt',
  captionDelay: 250,
});

form.addEventListener('submit', handleSearch);
loadMoreBtn.addEventListener('click', handleLoadMore);

// --- 1. ОБРОБКА ПЕРШОГО ПОШУКУ (САБМІТ ФОРМИ) ---
async function handleSearch(event) {
  event.preventDefault();

  // Отримуємо і зберігаємо запит у глобальну змінну
  searchQuery = event.currentTarget.elements.searchQuery.value.trim();

  if (searchQuery === '') {
    iziToast.warning({ title: 'Warning', message: 'Please enter a search query!' });
    return;
  }

  // Повертаємо page до початкового значення для нової колекції
  page = 1;
  galleryContainer.innerHTML = ''; // Очищаємо галерею
  hideLoadMoreBtn(); // При повторному сабміті кнопка спочатку ховається
  showLoader();

  try {
    const data = await fetchImages(searchQuery, page);

    if (data.hits.length === 0) {
      iziToast.error({
        title: 'Error',
        message: 'Sorry, there are no images matching your search query. Please try again!',
      });
      return;
    }

    // Рендеримо першу порцію карток
    const markup = createGalleryMarkup(data.hits);
    galleryContainer.innerHTML = markup;
    
    lightbox.refresh();
    
    // Керуємо видимістю кнопки Load more
    checkPaginationStatus(data.totalHits);

  } catch (error) {
    showErrorNotification();
    console.error(error);
  } finally {
    hideLoader();
    form.reset(); // Очищаємо інпут після сабміту
  }
}

// --- 2. ОБРОБКА КЛІКУ НА КНОПКУ "LOAD MORE" ---
async function handleLoadMore() {
  page += 1; // З кожним наступним запитом збільшуємо на 1
  hideLoadMoreBtn(); // Ховаємо кнопку на час завантаження додаткової порції
  showLoader();

  try {
    const data = await fetchImages(searchQuery, page);
    
    // ДОДАЄМО нову розмітку до вже існуючих елементів
    const markup = createGalleryMarkup(data.hits);
    galleryContainer.insertAdjacentHTML('beforeend', markup);
    
    lightbox.refresh();
    
    // Плавне прокручування сторінки
    smoothScroll();

    // Перевіряємо, чи не дійшли до кінця колекції
    checkPaginationStatus(data.totalHits);

  } catch (error) {
    showErrorNotification();
    console.error(error);
  } finally {
    hideLoader();
  }
}

// --- 3. ДОПОМІЖНІ ФУНКЦІЇ ---

function checkPaginationStatus(totalHits) {
  const maxPages = Math.ceil(totalHits / perPage);

  // Якщо користувач дійшов до кінця або результатів менше ніж на 1 сторінку
  if (page >= maxPages) {
    hideLoadMoreBtn();
    iziToast.info({
      title: 'End of results',
      message: "We're sorry, but you've reached the end of search results.",
      position: 'bottomCenter',
    });
  } else {
    showLoadMoreBtn(); // Показуємо кнопку, якщо є наступна сторінка
  }
}

function smoothScroll() {
  // Отримуємо першу картку з відрендерених
  const firstCard = galleryContainer.firstElementChild;
  if (!firstCard) return;

  // Вираховуємо висоту однієї картки
  const { height: cardHeight } = firstCard.getBoundingClientRect();

  // Прокручуємо сторінку на дві висоти картки галереї
  window.scrollBy({
    top: cardHeight * 2,
    behavior: 'smooth',
  });
}

function showLoader() { loader.classList.remove('hidden'); }
function hideLoader() { loader.classList.add('hidden'); }
function showLoadMoreBtn() { loadMoreBtn.classList.remove('hidden'); }
function hideLoadMoreBtn() { loadMoreBtn.classList.add('hidden'); }

function showErrorNotification() {
  iziToast.error({ title: 'Error', message: 'Something went wrong. Try again!' });
}