const form = document.querySelector('.search-form');
const input = document.querySelector('input');
const gallery = document.querySelector('.gallery');
const loadMoreBtn = document.querySelector('.load-more');

let page = 1;
let currentSearch = '';

loadMoreBtn.style.display = 'none';
form.addEventListener('submit', searchBtn);
loadMoreBtn.addEventListener('click', loadMore);

function searchBtn(event) {
  event.preventDefault();

  page = 1;
  gallery.innerHTML = '';
  currentSearch = input.value;

  if (currentSearch) {
    pixabay(currentSearch);
  } else {
    loadMoreBtn.style.display = 'none';
    return Notiflix.Notify.failure(
      'Sorry, there are no images matching your search query. Please try again.'
    );
  }
}

async function pixabay(inputSpace) {
  try {
    const API_URL = 'https://pixabay.com/api/';
    const API_KEY = '43932824-2394d690250123aeeaa69bc87';
    const params = {
      key: API_KEY,
      q: inputSpace,
      image_type: 'photo',
      orientation: 'horizontal',
      safesearch: true,
      per_page: 40,
      page: page,
    };
    const response = await axios.get(API_URL, { params });
    notification(response.data.hits.length, response.data.total);
    createMarkup(response.data.hits);
    console.log(response);
  } catch (error) {
    console.error(error);
  }
}

function loadMore() {
  page += 1;
  pixabay(currentSearch);
}

function scrollPage() {
  const firstCard = gallery.firstElementChild;
  const cardHeight = firstCard.clientHeight;
  const currentScroll = window.scrollY;
  const targetScroll = currentScroll + cardHeight * 2;

  window.scroll({
    top: targetScroll,
    behavior: 'smooth',
  });
}

function createMarkup(array) {
  const markup = array
    .map(
      ({
        largeImageURL,
        webformatURL,
        tags,
        likes,
        views,
        comments,
        downloads,
      }) =>
        `<a class="photo-link" href="${largeImageURL}">
            <div class="photo-card">
                <div class="photo">
                    <img src="${webformatURL}" alt="${tags}" loading="lazy"/>
                </div>
                <div class="info">
                    <p class="info-item">
                        <b>Likes</b>
                        ${likes}
                    </p>
                    <p class="info-item">
                        <b>Views</b>
                        ${views}
                    </p>
                    <p class="info-item">
                        <b>Comments</b>
                        ${comments}
                    </p>
                    <p class="info-item">
                        <b>Downloads</b>
                        ${downloads}
                    </p>
                </div>
            </div>
        </a>`
    )
    .join('');
  gallery.insertAdjacentHTML('beforeend', markup);
  simpleLightBox.refresh();

  if (page > 1) {
    scrollPage();
  }
}

const simpleLightBox = new SimpleLightbox('.gallery a', {
  captionsData: 'alt',
  captionDelay: 250,
});

function notification(length, totalHits) {
  if (length === 0) {
    loadMoreBtn.style.display = 'none';
    Notiflix.Notify.failure(
      'Sorry, there are no images matching your search query. Please try again.'
    );
    return;
  }

  if (page === 1) {
    loadMoreBtn.style.display = 'flex';
    Notiflix.Notify.success(`Hooray! We found ${totalHits} images.`);
  }

  if (length < 40) {
    loadMoreBtn.style.display = 'none';
    Notiflix.Notify.info(
      "We're sorry, but you've reached the end of search results."
    );
  }
}
//# sourceMappingURL=index.cdc84ddc.js.map
