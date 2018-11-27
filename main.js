const log = (...args) => console.log.apply(undefined, ['DDG-CON', ...args]);
const err = (...args) => log(`Error: `, args);
const onError = e => err(e);

browser.runtime.onMessage.addListener(request => {
  log(request.greeting);
  return Promise.resolve({ response: 'Received in content script.' });
});
log(document.domain);
