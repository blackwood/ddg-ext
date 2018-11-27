const log = (...args) => console.log.apply(undefined, ['DDG-BKG', ...args]);
const err = (...args) => log(`Error: `, args);
const onError = e => err(e);
let parser = document.createElement('a');
const getHostname = url => {
  parser.href = url;
  return parser.hostname;
};
let blocked = {};
let domain = '';
const recordBlocked = hostname => {
  if (typeof blocked[domain] === 'undefined') {
    blocked[domain] = [];
  }
  blocked[domain].push(hostname);
  browser.storage.local
    .set({
      blocked
    })
    .then(log, onError);
  log(blocked);
};
const setDomain = val => {
  domain = val;
};

document.addEventListener('DOMContentLoaded', function() {
  browser.tabs.query(
    {
      active: true,
      currentWindow: true,
      status: 'complete',
      windowType: 'normal'
    },
    tabs => setDomain(getHostname(tabs.map(tab => tab.url)[0]))
  );
});

Promise.all([
  fetch('./BLOCKLIST').then(res => res.text()),
  browser.storage.sync
    .get('userblocklist')
    .then(res => (res.userblocklist ? res.userblocklist.split('\n') : [])),
  browser.tabs.getCurrent().then(log)
])
  .then(([blocklist, userblocklist]) => {
    const list = blocklist
      .split('\n')
      .concat(userblocklist)
      .filter(Boolean);
    log(userblocklist);
    const handleBeforeRequest = request => {
      const hostname = getHostname(request.url);
      if (hostname.trim().length > 0 && list.indexOf(hostname) > -1) {
        log(`BLOCKED: ${hostname}`);
        recordBlocked(hostname);
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
