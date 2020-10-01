const form = document.querySelector('.search-form');
const artistInput = document.querySelector('input[name="artist"]');
const titleInput = document.querySelector('input[name="title"]');
const lyricsContainer = document.querySelector('.lyrics');
const proxy = 'https://cors-anywhere.herokuapp.com/';
const endpoint = 'http://api.musixmatch.com/ws/1.1/';
const apikey = 'c62ff897dc4898e90376bd591ca2c32e';

async function fetchSong() {
  const response = await fetch(
    `${proxy}${endpoint}track.search?q_artist=${artistInput.value}&q_track=${titleInput.value}&s_track_rating=desc&f_has_lyrics&apikey=${apikey}`
  );
  const data = await response.json();
  return data.message.body.track_list[0];
}

async function fetchArtistSongs() {
  const response = await fetch(
    `${proxy}${endpoint}track.search?q_artist=${artistInput.value}&s_track_rating=desc&f_has_lyrics&apikey=${apikey}`
  );
  const data = await response.json();
  return data.message.body.track_list[0];
}

async function fetchSongsByTitle() {
  const response = await fetch(
    `${proxy}${endpoint}track.search?q_track=${titleInput.value}&s_track_rating=desc&f_has_lyrics&apikey=${apikey}`
  );
  const data = await response.json();
  return data.message.body.track_list[0];
}

async function getLyrics() {
  let response;
  if (artistInput.value && titleInput.value) {
    response = await fetchSong();
  } else if (artistInput.value) {
    response = await fetchArtistSongs();
  } else if (titleInput.value) {
    response = await fetchSongsByTitle();
  }
  const trackId = response.track.track_id;
  const data = await fetch(
    `${proxy}${endpoint}track.lyrics.get?track_id=${trackId}&apikey=${apikey}`
  );
  const lyrics = await data.json();
  return lyrics.message.body.lyrics.lyrics_body;
}

async function displayLyrics(e) {
  e.preventDefault();
  const lyricsText = await getLyrics();
  lyricsContainer.textContent = `${lyricsText}`;
}

form.addEventListener('submit', displayLyrics);
