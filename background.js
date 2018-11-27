const log = (...args) => console.log.apply(undefined, ['DDG', ...args]);
const err = (...args) => log(`Error: `, args);
const onError = e => err(e);

Promise.all([
  fetch('./BLOCKLIST').then(res => res.text()),
  browser.storage.sync
    .get('userblocklist')
    .then(res => (res.userblocklist ? res.userblocklist.split('\n') : []))
])
  .then(([blocklist, userblocklist]) => {
    const list = blocklist
      .split('\n')
      .concat(userblocklist)
      .filter(Boolean);

    const handleBeforeRequest = request => {
      let parser = document.createElement('a');
      parser.href = request.url;
      if (
        parser.hostname.trim().length > 0 &&
        list.indexOf(parser.hostname) > -1
      ) {
        log(`BLOCKED: ${parser.hostname}`);
        return {
          cancel: true
        };
      }
    };

    browser.webRequest.onBeforeRequest.addListener(
      handleBeforeRequest,
      {
        urls: ['<all_urls>']
      },
      ['blocking']
    );
  })
  .catch(onError);
