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

let searchQuery = '';
let page = 1;
const perPage = 15;

let lightbox = new SimpleLightbox('.gallery a', {
  captionsData: 'alt',
  captionDelay: 250,
});

form.addEventListener('submit', handleSearch);
loadMoreBtn.addEventListener('click', handleLoadMore);

async function handleSearch(event) {
  event.preventDefault();

   searchQuery = event.currentTarget.elements.searchQuery.value.trim();

  if (searchQuery === '') {
    iziToast.warning({ title: 'Warning', message: 'Please enter a search query!' });
    return;
  }

  page = 1;
  galleryContainer.innerHTML = ''; 
  hideLoadMoreBtn(); 
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

    const markup = createGalleryMarkup(data.hits);
    galleryContainer.innerHTML = markup;
    
    lightbox.refresh();
    
    checkPaginationStatus(data.totalHits);

  } catch (error) {
    showErrorNotification();
    console.error(error);
  } finally {
    hideLoader();
    form.reset(); 
  }
}

async function handleLoadMore() {
  page += 1; 
  hideLoadMoreBtn(); 
  showLoader();

  try {
    const data = await fetchImages(searchQuery, page);
    
     const markup = createGalleryMarkup(data.hits);
    galleryContainer.insertAdjacentHTML('beforeend', markup);
    
    lightbox.refresh();
    
    smoothScroll();

    checkPaginationStatus(data.totalHits);

  } catch (error) {
    showErrorNotification();
    console.error(error);
  } finally {
    hideLoader();
  }
}

function checkPaginationStatus(totalHits) {
  const maxPages = Math.ceil(totalHits / perPage);

  if (page >= maxPages) {
    hideLoadMoreBtn();
    iziToast.info({
      title: 'End of results',
      message: "We're sorry, but you've reached the end of search results.",
      position: 'bottomCenter',
    });
  } else {
    showLoadMoreBtn(); 
  }
}

function smoothScroll() {
   const firstCard = galleryContainer.firstElementChild;
  if (!firstCard) return;

  const { height: cardHeight } = firstCard.getBoundingClientRect();

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