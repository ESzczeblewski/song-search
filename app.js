/* eslint-disable no-use-before-define */
const form = document.querySelector('.search-form');
const artistInput = document.querySelector('input[name="artist"]');
const titleInput = document.querySelector('input[name="title"]');
const songsContainer = document.querySelector('.songs');
const errorPopup = document.querySelector('.errorPopup');
const proxy = 'https://cors-anywhere.herokuapp.com/';
const endpoint = 'http://api.musixmatch.com/ws/1.1/';
const apikey = 'c62ff897dc4898e90376bd591ca2c32e';

function handleSubmit(e) {
  e.preventDefault();
  songsContainer.innerHTML = '';
  if (artistInput.value && titleInput.value) {
    fetchSong();
  } else if (artistInput.value) {
    fetchArtistSongs();
  } else if (titleInput.value) {
    fetchSongsByTitle();
  } else {
    artistInput.blur();
    handleError('No input!');
  }
}

async function fetchSong() {
  const response = await fetch(
    `${proxy}${endpoint}track.search?q_artist=${artistInput.value}&q_track=${titleInput.value}&s_track_rating=desc&f_has_lyrics=1&apikey=${apikey}`
  );
  const data = await response.json();
  const dataArray = data.message.body.track_list;
  displaySongs(dataArray);
}

async function fetchArtistSongs() {
  const response = await fetch(
    `${proxy}${endpoint}track.search?q_artist=${artistInput.value}&s_track_rating=desc&page_size=10&apikey=${apikey}`
  );
  const data = await response.json();
  const dataArray = data.message.body.track_list;
  displaySongs(dataArray);
}

async function fetchSongsByTitle() {
  const response = await fetch(
    `${proxy}${endpoint}track.search?q_track=${titleInput.value}&s_track_rating=desc&f_has_lyrics=1&apikey=${apikey}`
  );
  const data = await response.json();
  const dataArray = data.message.body.track_list;
  displaySongs(dataArray);
}

function displaySongs(songs) {
  if (songs.length) {
    songs.forEach((e) => {
      const song = document.createElement('div');
      song.classList.add('song');
      song.id = e.track.track_id;
      song.insertAdjacentHTML(
        'afterbegin',
        `${e.track.artist_name} ${e.track.track_name} <button>See lyrics</button>`
      );
      songsContainer.appendChild(song);
      song.addEventListener('click', (event) =>
        displayLyrics(parseInt(event.currentTarget.id))
      );
    });
  } else {
    handleError('No lyrics found!');
  }
}

async function getLyrics(id) {
  const trackId = id;
  const data = await fetch(
    `${proxy}${endpoint}track.lyrics.get?track_id=${trackId}&apikey=${apikey}`
  );
  const lyrics = await data.json();
  return lyrics.message.body.lyrics.lyrics_body;
}

function handleError(message) {
  errorPopup.classList.add('errorOpen');
  let errorMessage = document.createElement('div');
  errorMessage.classList.add('errorMessage');
  errorMessage.insertAdjacentHTML(
    'afterbegin',
    `${message} <button class="errBtn" data-js="button">Ok</button>`
  );
  errorPopup.appendChild(errorMessage);
  errorMessage.addEventListener('click', (e) => {
    if (e.target.hasAttribute('data-js')) {
      errorPopup.classList.remove('errorOpen');
      errorMessage.remove();
      errorMessage = null;
    }
  });
}

async function displayLyrics(id) {
  const lyricsText = await getLyrics(id);
  songsContainer.innerHTML = `${lyricsText.replace(/(\r\n|\r|\n)/g, '<br>')}`;
}

form.addEventListener('submit', handleSubmit);
// ! work on custom error popups
