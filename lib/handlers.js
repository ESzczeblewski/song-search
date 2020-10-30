import { spinnerOn, spinnerOff } from './utils.js';
import { submitBtn, artistInput, titleInput, errorPopup } from './elements.js';

import { fetchSongs } from './index.js';

export function handleError(message) {
  artistInput.blur();
  titleInput.blur();
  spinnerOff();
  errorPopup.classList.add('errorOpen');
  let errorMessage = document.createElement('div');
  errorMessage.classList.add('errorMessage');
  errorMessage.insertAdjacentHTML(
    'afterbegin',
    `<span class="message">${message}</span> <button class="errBtn" data-js="button">Ok</button>`
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

export async function handleSubmit(e) {
  e.preventDefault();
  spinnerOn();
  if (artistInput.value || titleInput.value) {
    fetchSongs();
    submitBtn.disabled = true;
  } else {
    submitBtn.disabled = true;
    spinnerOff();
    handleError('No input!');
  }
}
