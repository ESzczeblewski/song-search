/* eslint-disable no-use-before-define */
import {
  proxy,
  endpoint,
  artistInput,
  titleInput,
  apikey,
  songsContainer,
  pageNumbers,
  submitBtn,
  navPrev,
  navNext,
} from './elements.js';
import { handleError } from './handlers.js';
import { spinnerOn, spinnerOff } from './utils.js';

let dataArray = [];
let lyricsText;
let currentPage = 1;
const rows = 10;

navPrev.addEventListener('click', () => {
  songsContainer.innerHTML = '';
  navPrev.disabled = true;
  displaySongs(dataArray, songsContainer, rows, currentPage);
  pageNumbers.classList.remove('hide');
});
navNext.addEventListener('click', () => {
  songsContainer.innerHTML = '';
  navPrev.disabled = false;
  navNext.disabled = true;
  songsContainer.innerHTML = `${lyricsText.replace(/(\r\n|\r|\n)/g, '<br>')}`;
  pageNumbers.classList.add('hide');
});

export async function fetchSongs() {
  lyricsText = undefined;
  navNext.disabled = true;
  const response = await fetch(
    `${proxy}${endpoint}track.search?q_artist=${artistInput.value}&q_track=${titleInput.value}&s_track_rating=desc&f_has_lyrics=1&page_size=30&apikey=${apikey}`
  );
  const data = await response.json();
  dataArray = data.message.body.track_list;
  displaySongs(dataArray, songsContainer, rows, currentPage);
  setupPagination(dataArray, pageNumbers, rows);
}

function displaySongs(songs, container, rowsPerPage, page) {
  container.innerHTML = '';
  page -= 1;
  const start = rowsPerPage * page;
  const end = start + rowsPerPage;
  const paginatedSongs = songs.slice(start, end);
  pageNumbers.classList.remove('hide');

  if (paginatedSongs.length) {
    paginatedSongs.forEach((e) => {
      const song = document.createElement('div');
      song.classList.add('song');
      song.id = e.track.track_id;
      song.insertAdjacentHTML(
        'afterbegin',
        `${e.track.artist_name} ${e.track.track_name} <button>See lyrics</button>`
      );
      songsContainer.appendChild(song);
      song.addEventListener('click', (event) => {
        spinnerOn();
        pageNumbers.classList.add('hide');
        displayLyrics(parseInt(event.currentTarget.id));
      });
    });
    spinnerOff();
    submitBtn.disabled = false;
    if (lyricsText !== undefined) {
      navNext.disabled = false;
    }
  } else {
    handleError('No lyrics found!');
  }
}

function setupPagination(songs, container, rowsPerPage) {
  container.innerHTML = '';
  const pageCount = Math.ceil(songs.length / rowsPerPage);

  for (let i = 1; i < pageCount + 1; i++) {
    const btn = paginationButton(i, songs);
    container.appendChild(btn);
  }
}

function paginationButton(page, songs) {
  const button = document.createElement('button');
  button.innerText = page;
  if (currentPage === page) button.classList.add('active');
  button.addEventListener('click', function () {
    currentPage = page;
    displaySongs(songs, songsContainer, rows, currentPage);
    const currentBtn = document.querySelector('.page-numbers button.active');
    currentBtn.classList.remove('active');
    button.classList.add('active');
  });

  return button;
}

async function getLyrics(id) {
  navPrev.disabled = false;
  const trackId = id;
  const data = await fetch(
    `${proxy}${endpoint}track.lyrics.get?track_id=${trackId}&apikey=${apikey}`
  );
  const lyrics = await data.json();
  if (lyrics.message.body.lyrics.lyrics_body === '') {
    handleError('No lyrics found!');
  }
  return lyrics.message.body.lyrics.lyrics_body;
}

async function displayLyrics(id) {
  navNext.disabled = true;
  try {
    lyricsText = await getLyrics(id);
    spinnerOff();
    songsContainer.innerHTML = `${lyricsText.replace(/(\r\n|\r|\n)/g, '<br>')}`;
  } catch (err) {
    handleError('No lyrics found');
  }
}
