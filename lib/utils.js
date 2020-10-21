import { spinner } from './elements.js';

export function spinnerOn() {
  spinner.classList.add('spinner-open');
}

export function spinnerOff() {
  spinner.classList.remove('spinner-open');
}
