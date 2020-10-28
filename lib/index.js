/* eslint-disable no-use-before-define */
import styled from 'styled-components';
import {
  proxy,
  endpoint,
  artistInput,
  titleInput,
  apikey,
  songsContainer,
  submitBtn,
} from './elements.js';
import { handleError } from './handlers.js';
import { spinnerOn, spinnerOff } from './utils.js';

export async function fetchSong() {
  const response = await fetch(
    `${proxy}${endpoint}track.search?q_artist=${artistInput.value}&q_track=${titleInput.value}&s_track_rating=desc&f_has_lyrics=1&apikey=${apikey}`
  );
  const data = await response.json();
  const dataArray = data.message.body.track_list;
  displaySongs(dataArray);
}

export async function fetchArtistSongs() {
  const response = await fetch(
    `${proxy}${endpoint}track.search?q_artist=${artistInput.value}&s_track_rating=desc&f_has_lyrics=1&page_size=10&apikey=${apikey}`
  );
  const data = await response.json();
  console.log(data);
  const dataArray = data.message.body.track_list;
  displaySongs(dataArray);
}

export async function fetchSongsByTitle() {
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
      // song = styled.div`
      //   display: grid;
      // `;
      songsContainer.appendChild(song);
      spinnerOff();
      submitBtn.disabled = false;
      song.addEventListener('click', (event) => {
        songsContainer.innerHTML = '';
        spinnerOn();
        displayLyrics(parseInt(event.currentTarget.id));
      });
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

async function displayLyrics(id) {
  try {
    const lyricsText = await getLyrics(id);
    spinnerOff();
    songsContainer.innerHTML = `${lyricsText.replace(/(\r\n|\r|\n)/g, '<br>')}`;
  } catch (err) {
    handleError('No lyrics found');
  }
}
