import { spinnerOn, spinnerOff } from './utils.js';
import {
  songsContainer,
  submitBtn,
  artistInput,
  titleInput,
  errorPopup,
} from './elements.js';

import { fetchSong, fetchArtistSongs, fetchSongsByTitle } from './index.js';

export function handleError(message) {
  artistInput.blur();
  titleInput.blur();
  spinnerOff();
  errorPopup.classList.add('errorOpen');
  let errorMessage = document.createElement('div');
  errorMessage.classList.add('errorMessage');
  errorMessage.insertAdjacentHTML(
    'afterbegin',
    `${message} <button class="errBtn" data-js="button">Ok</button>`
  );
  errorPopup.appendChild(errorMessage);
  errorMessage.querySelector('.errBtn').focus();
  errorMessage.addEventListener('click', (e) => {
    if (e.target.hasAttribute('data-js')) {
      errorPopup.classList.remove('errorOpen');
      errorMessage.remove();
      errorMessage = null;
      submitBtn.disabled = false;
    }
  });
}

export function handleSubmit(e) {
  e.preventDefault();
  spinnerOn();
  songsContainer.innerHTML = '';
  if (artistInput.value && titleInput.value) {
    fetchSong();
    submitBtn.disabled = true;
  } else if (artistInput.value) {
    fetchArtistSongs();
    submitBtn.disabled = true;
  } else if (titleInput.value) {
    fetchSongsByTitle();
    submitBtn.disabled = true;
  } else {
    submitBtn.disabled = true;
    spinnerOff();
    handleError('No input!');
  }
}
