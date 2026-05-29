import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';

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
  if (galleryContainer) {
    galleryContainer.innerHTML = '';
  }
}

export function renderGallery(images) {
  if (!galleryContainer) return;
  galleryContainer.innerHTML = createGalleryMarkup(images);
  lightbox.refresh();
}

export function appendToGallery(images) {
  if (!galleryContainer) return;
  galleryContainer.insertAdjacentHTML('beforeend', createGalleryMarkup(images));
  lightbox.refresh();
}

export function showLoader() {
  if (loader) loader.classList.remove('hidden');
}

export function hideLoader() {
  if (loader) loader.classList.add('hidden');
}

export function showLoadMoreBtn() {
  if (loadMoreBtn) loadMoreBtn.classList.remove('hidden');
}

export function hideLoadMoreBtn() {
  if (loadMoreBtn) loadMoreBtn.classList.add('hidden');
}

export function smoothScroll() {
  if (!galleryContainer) return;
  const firstCard = galleryContainer.firstElementChild;
  if (!firstCard) return;

  const { height: cardHeight } = firstCard.getBoundingClientRect();

  window.scrollBy({
    top: cardHeight * 2,
    behavior: 'smooth',
  });
}