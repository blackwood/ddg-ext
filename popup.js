const log = (...args) => console.log.apply(undefined, ['DDG-POP', ...args]);
const err = (...args) => log(`Error: `, args);
const onError = e => err(e);
let parser = document.createElement('a');
const getHostname = url => {
  parser.href = url;
  return parser.hostname;
};

const domain = document.getElementById('domain');
const setDomainHTML = url => {
  domain.innerHTML = getHostname(url);
};
const blockedlist = document.getElementById('blockedlist');
const setBlockedlistHTML = url => {
  browser.storage.local.get().then(({ blocked = {} }) => {
    const blockedlistHTML = blocked[getHostname(url)]
      .map(hostname => {
        log(hostname);
        return `<li>${hostname}</li>`;
      })
      .join();
    log(blockedlistHTML);
    blockedlist.innerHTML = blockedlistHTML;
  }, onError);
};

document.addEventListener('DOMContentLoaded', function() {
  browser.tabs.query(
    {
      active: true,
      currentWindow: true,
      status: 'complete',
      windowType: 'normal'
    },
    tabs => {
      const [url] = tabs.map(tab => tab.url);
      setDomainHTML(url);
      setBlockedlistHTML(url);
    }
  );
});
