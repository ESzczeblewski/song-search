import { songsContainer, spinner } from './elements.js';

export function spinnerOn() {
  songsContainer.innerHTML = '';
  spinner.classList.add('spinner-open');
}

export function spinnerOff() {
  spinner.classList.remove('spinner-open');
}
