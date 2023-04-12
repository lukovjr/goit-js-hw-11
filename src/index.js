import { FetchPhoto } from './fetchPhoto.js';
import Notiflix from 'notiflix';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';

const searchFormEl = document.querySelector('.search-form');
const inputEl = document.querySelector('.input');
const galleryEl = document.querySelector('.gallery');
const loadMoreEl = document.querySelector('.load-more');

const fetchImgAPI = new FetchPhoto();

let total = 0;
let lightbox;

searchFormEl.addEventListener('submit', onSearchImageBtnClick);
loadMoreEl.addEventListener('click', onLoadMoreBtnClick);
window.addEventListener('scroll', onScroll);


async function onSearchImageBtnClick(event) {
  event.preventDefault();
  total = 0;

  total += fetchImgAPI.perPage;

 
  if (!(inputEl.value.trim())) {
    Notiflix.Notify.failure(`Enter some...`);
    return;
  }

  fetchImgAPI.page = 1;

  fetchImgAPI.photo = inputEl.value.trim();

  try {
    const { data } = await fetchImgAPI.fetchPhoto();

    const galleryItems = data.hits;
    
    galleryEl.innerHTML = makeGalleryMarkUp(galleryItems);

    lightbox = new SimpleLightbox('.photo-card a', {
      captionsData: 'alt',
      captionDelay: 250,
      scrollZoom: false,
    }).refresh();

    if (data.totalHits != 0) {
      Notiflix.Notify.success(`"Hooray! We found ${data.totalHits} images."`);
    }

    if (data.totalHits === 0) {
      loadMoreEl.classList.add('is-hidden');
      return Notiflix.Notify.failure(
        'Sorry, there are no images matching your search query. Please try again.');

    } else if (data.totalHits < fetchImgAPI.perPage || data.totalHits === 0) {
      loadMoreEl.classList.add('is-hidden');
      galleryEl.insertAdjacentHTML(
        'beforeend',
        `<div class="message">"We're sorry, but you've reached the end of search results."</div>`
      );
      return;
    }

    loadMoreEl.classList.remove('is-hidden');
  } catch (error) {
    console.log(error);
  }
}

async function onLoadMoreBtnClick() {
  fetchImgAPI.page += 1;
  lightbox.destroy();

  try {
    const { data } = await fetchImgAPI.fetchPhoto();

    total += fetchImgAPI.perPage;

    const galleryItems = data.hits;

    galleryEl.insertAdjacentHTML('beforeend', makeGalleryMarkUp(galleryItems));
    lightbox = new SimpleLightbox('.photo-card a', {
      captionsData: 'alt',
      captionDelay: 250,
      scrollZoom: false,
    }).refresh();

    if (data.totalHits < total) {
      loadMoreEl.classList.add('is-hidden');
      galleryEl.insertAdjacentHTML(
    'beforeend',
    `<div class="message">"We're sorry, but you've reached the end of search results."</div>`
  );
    }
  } catch (error) {
    console.log(error);
  }
}

function makeGalleryMarkUp(galleryItems) {
  return galleryItems
    .map(
      ({
        webformatURL,
        largeImageURL,
        tags,
        likes,
        views,
        comments,
        downloads,
      }) => {
        return `<div class="photo-card">
  <a href="${largeImageURL}"><img src="${webformatURL}" alt="${tags}" loading="lazy" width="300px"height="300px"/></a>
  <div class="info">
    <p class="info-item">
      <b>Likes:</b> ${likes}
    </p>
    <p class="info-item">
      <b>Views:</b> ${views}
    </p>
    <p class="info-item">
      <b>Comments:</b> ${comments}
    </p>
    <p class="info-item">
      <b>Downloads:</b> ${downloads}
    </p>
  </div>
</div>`;
      }
    )
    .join('');
  }


  function onScroll(e) {
    const { height: cardHeight } = document
    .querySelector(".gallery")
    .firstElementChild.getBoundingClientRect();
  console.log(cardHeight);
  
  window.scrollBy({
    top: cardHeight * 2,
    behavior: "smooth",
  });
  }



const onEntry = entries => {
  entries.forEach(entry => {
   
    if (entry.isIntersecting && fetchImgAPI.photo !== '') {
      onLoadMoreBtnClick();
    }
  });
};

const options = {
   rootMargin: '300px'
};

const observer = new IntersectionObserver(onEntry, options);
observer.observe(loadMoreEl);