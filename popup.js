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
const setBlockedlistHTML = blocked => {
  blockedlist.innerHTML = JSON.stringify(blocked);
};

document.addEventListener('DOMContentLoaded', function() {
  browser.tabs.query(
    {
      active: true,
      currentWindow: true,
      status: 'complete',
      windowType: 'normal'
    },
    tabs => setDomainHTML(tabs.map(tab => tab.url)[0])
  );
});

async function retreiveBlockedlist() {
  await browser.storage.local
    .get()
    .then(({ blocked }) => setBlockedlistHTML(blocked), onError);
}

retreiveBlockedlist();
