import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';

// Пошук DOM-елементів тепер живе тут
const galleryContainer = document.querySelector('.gallery');
const loadMoreBtn = document.querySelector('#load-more');
const loader = document.querySelector('.loader');

let lightbox = new SimpleLightbox('.gallery a', {
  captionsData: 'alt',
  captionDelay: 250,
});

export function createGalleryMarkup(images) {
  return images
    .map(
      ({ webformatURL, largeImageURL, tags, likes, views, comments, downloads }) => `
    <li class="gallery-item">
      <a class="gallery-link" href="${largeImageURL}">
        <img class="gallery-image" src="${webformatURL}" alt="${tags}" loading="lazy" />
      </a>
      <div class="info">
        <div class="info-block"><span class="info-label">Likes</span><span>${likes}</span></div>
        <div class="info-block"><span class="info-label">Views</span><span>${views}</span></div>
        <div class="info-block"><span class="info-label">Comments</span><span>${comments}</span></div>
        <div class="info-block"><span class="info-label">Downloads</span><span>${downloads}</span></div>
      </div>
    </li>
  `
    )
    .join('');
}

export function clearGallery() {
  galleryContainer.innerHTML = '';
}

export function renderGallery(images) {
  const markup = createGalleryMarkup(images);
  galleryContainer.innerHTML = markup;
  lightbox.refresh(); 

export function appendToGallery(images) {
  const markup = createGalleryMarkup(images);
  galleryContainer.insertAdjacentHTML('beforeend', markup);
  lightbox.refresh(); 
}

export function showLoader() {
  loader.classList.remove('hidden');
}

export function hideLoader() {
  loader.classList.add('hidden');
}

export function showLoadMoreBtn() {
  loadMoreBtn.classList.remove('hidden');
}

export function hideLoadMoreBtn() {
  loadMoreBtn.classList.add('hidden');
}

export function smoothScroll() {
  const firstCard = galleryContainer.firstElementChild;
  if (!firstCard) return;

  const { height: cardHeight } = firstCard.getBoundingClientRect();

  window.scrollBy({
    top: cardHeight * 2,
    behavior: 'smooth',
  });
}