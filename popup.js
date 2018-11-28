import { makeLogger, getHostname } from './utils';
const { onError } = makeLogger('POP');

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
  const setPopupHTML = () => {
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
        setTimeout(setPopupHTML, 5000);
      }
    );
  };
  setPopupHTML();
});
