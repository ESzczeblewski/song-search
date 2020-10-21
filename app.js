/* eslint-disable no-use-before-define */
import { form } from './lib/elements.js';
import { handleSubmit } from './lib/handlers.js';

form.addEventListener('submit', handleSubmit);
