// import cardTemplates from './tamplates/card.hbs'
import NewsApiService from './news-service';
import LoadMoreBtn from './load-more-btn';
import SimpleLightbox from "simplelightbox";
import "simplelightbox/dist/simple-lightbox.min.css";
import Notiflix from 'notiflix';

const refs = {
    searchForm: document.querySelector('.search-form'),
    gallery: document.querySelector('.gallery'),
    // loadMoreBtn: document.querySelector('.load-more')
};

const simplelightbox = new SimpleLightbox(".gallery a");
const loadMoreBtn = new LoadMoreBtn({
  selector: '[data-action="Load more"]',
  hidden: true,
});
const newsApiService = new NewsApiService();

refs.searchForm.addEventListener('submit', onSearch);
loadMoreBtn.refs.button.addEventListener('click', onLoadMore);

function onSearch(e) {
  e.preventDefault();
  
  newsApiService.query = e.currentTarget.elements.searchQuery.value.trim();

  if (newsApiService.query === '') {
   return  Notiflix.Notify.failure('Please enter the text request!');
  };

  loadMoreBtn.show()
  loadMoreBtn.disable()
  newsApiService.resetPage();
  newsApiService.fetchArticles()
      .then(({hits, totalHits}) => {
        clearCardMarkup(newsApiService);
        if (hits.length === 0) {
          return Notiflix.Notify.failure('Sorry, there are no images matching your search query. Please try again.');
        };
        Notiflix.Notify.success(`Hooray! We found ${totalHits} images!`)
        return hits.reduce((markap, hit) =>  createCardMarkup(hit) + markap, ''
      )
        })
    .then((markap) => {
      if (!markap) {
        return loadMoreBtn.hide()
      } else {
        loadMoreBtn.enable();
        appendCardMarkup(markap);
        
      }
    })
    .catch(error => console.log(error))
    .finally(() => simplelightbox.refresh());
};

function onLoadMore() {
  loadMoreBtn.disable();
    newsApiService.fetchArticles()
      .then(({hits}) => {
        if (hits.length === 0) {
          Notiflix.Notify.failure("We're sorry, but you've reached the end of search results.");
          loadMoreBtn.hide();
          return
        }
            return hits.reduce((markap, hit) =>
                createCardMarkup(hit) + markap, '')
        })
      .then((markap) => {
        appendCardMarkup(markap);
        loadMoreBtn.enable();
      })
      .catch(error => console.log(error))
      .finally(() => simplelightbox.refresh());
};

function appendCardMarkup(markap) {
    refs.gallery.insertAdjacentHTML('beforeend', markap);
};

function clearCardMarkup() {
    refs.gallery.innerHTML = '';
};

function createCardMarkup({webformatURL, largeImageURL, tags, likes, views, comments, downloads}) {
    return `
    <div class="photo-card card-set-item">
    <a href="${largeImageURL}">
    <div class="tamb">
    <img src="${webformatURL}" alt="${tags}" width=400 height=200 loading="lazy" />
    </div>
  <div class="info">
    <p class="info-item">
      <b>Likes</b>
      <span class="info-card">${likes}</span>
    </p>
    <p class="info-item">
      <b>Views</b>
      <span class="info-card">${views}</span>
    </p>
    <p class="info-item">
      <b>Comments</b>
      <span class="info-card">${comments}</span>
    </p>
    <p class="info-item">
      <b>Downloads</b>
      <span class="info-card">${downloads}</span>
    </p>
  </div>
  </a>
  </div>
  `
};
