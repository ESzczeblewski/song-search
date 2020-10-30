/* eslint-disable no-use-before-define */
import {
  proxy,
  endpoint,
  artistInput,
  titleInput,
  apikey,
  songsContainer,
  submitBtn,
  navPrev,
  navNext,
} from './elements.js';
import { handleError } from './handlers.js';
import { spinnerOn, spinnerOff } from './utils.js';

let dataArray = [];
let lyricsText;

navPrev.addEventListener('click', () => {
  songsContainer.innerHTML = '';
  navPrev.disabled = true;
  displaySongs(dataArray);
});
navNext.addEventListener('click', () => {
  songsContainer.innerHTML = '';
  navPrev.disabled = false;
  navNext.disabled = true;
  songsContainer.innerHTML = `${lyricsText.replace(/(\r\n|\r|\n)/g, '<br>')}`;
});

export async function fetchSongs() {
  lyricsText = undefined;
  navNext.disabled = true;
  const response = await fetch(
    `${proxy}${endpoint}track.search?q_artist=${artistInput.value}&q_track=${titleInput.value}&s_track_rating=desc&f_has_lyrics=1&apikey=${apikey}`
  );
  const data = await response.json();
  dataArray = data.message.body.track_list;
  displaySongs(dataArray);
}

function displaySongs(songs) {
  if (songs.length) {
    songs.forEach((e) => {
      const song = document.createElement('div');
      song.style.display = 'grid';
      song.style.gap = '0.5em';
      song.style.margin = '1em 0';
      song.style.padding = '0 1em';
      song.classList.add('song');
      song.id = e.track.track_id;
      song.insertAdjacentHTML(
        'afterbegin',
        `${e.track.artist_name} ${e.track.track_name} <button>See lyrics</button>`
      );
      songsContainer.appendChild(song);
      song.addEventListener('click', (event) => {
        spinnerOn();
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

async function getLyrics(id) {
  navPrev.disabled = false;
  const trackId = id;
  const data = await fetch(
    `${proxy}${endpoint}track.lyrics.get?track_id=${trackId}&apikey=${apikey}`
  );
  const lyrics = await data.json();
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
