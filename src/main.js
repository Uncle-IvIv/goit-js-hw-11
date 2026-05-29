import iziToast from 'izitoast';
import 'izitoast/dist/css/iziToast.min.css';

import { fetchImages } from './js/pixabay-api.js';
import {
  renderGallery,
  appendToGallery,
  clearGallery,
  showLoader,
  hideLoader,
  showLoadMoreBtn,
  hideLoadMoreBtn,
  smoothScroll
} from './js/render-functions.js';

const form = document.querySelector('#search-form');
const loadMoreBtn = document.querySelector('#load-more'); // Потрібно додати назад сюди, щоб повісити addEventListener

let searchQuery = '';
let page = 1;
const perPage = 15;

form.addEventListener('submit', handleSearch);
if (loadMoreBtn) {
  loadMoreBtn.addEventListener('click', handleLoadMore);
}

async function handleSearch(event) {
  event.preventDefault();

  searchQuery = event.currentTarget.elements.searchQuery.value.trim();

  if (searchQuery === '') {
    iziToast.warning({ title: 'Warning', message: 'Please enter a search query!' });
    form.reset();
    return;
  }

  page = 1;
  clearGallery(); 
  hideLoadMoreBtn(); 
  showLoader();

  try {
    const data = await fetchImages(searchQuery, page);

    if (data.hits.length === 0) {
      iziToast.error({
        title: 'Error',
        message: 'Sorry, there are no images matching your search query. Please try again!',
      });
      form.reset();
      return;
    }

    renderGallery(data.hits);
    checkPaginationStatus(data.totalHits);

  } catch (error) {
    showErrorNotification();
    console.error(error);
  } finally {
    hideLoader();
  }
}

async function handleLoadMore() {
  page += 1; 
  hideLoadMoreBtn(); 
  showLoader();

  try {
    const data = await fetchImages(searchQuery, page);
    
    appendToGallery(data.hits);
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

function showErrorNotification() {
  iziToast.error({ title: 'Error', message: 'Something went wrong. Try again!' });
}