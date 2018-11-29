import { makeLogger, getHostname, noop, getActiveTabDomain } from './utils';
const { log, onError } = makeLogger('BKG');

const recordBlocked = (domain, hostname) => {
  browser.storage.sync
    .get('blocked')
    .then(({ blocked = {} }) => blocked)
    .then(blocked => {
      if (typeof blocked[domain] === 'undefined') {
        blocked[domain] = [];
      }
      blocked[domain].push(hostname);
      browser.storage.sync
        .set({
          blocked
        })
        .then(noop, onError);
    });
};

Promise.all([
  fetch('./../BLOCKLIST').then(res => res.text()),
  browser.storage.sync
    .get('userblocklist')
    .then(({ userblocklist = '' }) =>
      userblocklist.length > 0 ? userblocklist.split('\n') : []
    )
])
  .then(([blocklist, userblocklist]) => {
    const list = blocklist
      .split('\n')
      .concat(userblocklist)
      .filter(Boolean);
    const handleBeforeRequest = request => {
      const hostname = getHostname(request.url);

      Promise.all([
        getActiveTabDomain(),
        browser.storage.sync.get('disabled').then(({ disabled = [] }) => {
          return disabled;
        })
      ]).then(([domain, disabled]) => {
        if (disabled.indexOf(domain) >= 0) {
          return;
        }
        if (hostname.trim().length > 0 && list.indexOf(hostname) >= 0) {
          log(`BLOCKED: ${hostname}`);
          recordBlocked(domain, hostname);
          return {
            cancel: true
          };
        }
      }).onError;
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
