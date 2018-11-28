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
    const list = blocked[getHostname(url)];
    if (typeof list === 'undefined' || list.length === 0) return;
    const blockedlistHTML = [...new Set(blocked[getHostname(url)])]
      .map((hostname, i) => {
        const classnames = i % 2 === 1 ? 'ph3 pv2' : 'ph3 pv2 stripe-dark';
        return `<li class="${classnames}">${hostname}</li>`;
      })
      .join('');
    blockedlist.innerHTML = blockedlistHTML;
  }, onError);
};

document.addEventListener('DOMContentLoaded', function() {
  browser.tabs.query(
    {
      active: true,
      currentWindow: true,
      windowType: 'normal'
    },
    tabs => {
      const [url] = tabs.map(tab => tab.url);
      setDomainHTML(url);
      setBlockedlistHTML(url);
    }
  );
});
