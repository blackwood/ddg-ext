import { makeLogger } from './utils';
const { log } = makeLogger('CON');

browser.runtime.onMessage.addListener(request => {
  log('Message received.');
  return Promise.resolve({ response: 'Received in content script.' });
});
