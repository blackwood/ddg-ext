import { makeLogger, getActiveTabDomain, xor, noop } from './utils';
const log = makeLogger('POP');
const domainTitle = document.getElementById('domain');
const setDomainTitleHTML = domain => {
  domainTitle.innerHTML = domain;
};
const blockedlist = document.getElementById('blockedlist');
const initialList = blockedlist.innerHTML;
const setBlockedlistHTML = (blocked, domain) => {
  const list = blocked[domain] || [];
  if (list.length === 0) {
    blockedlist.innerHTML = initialList;
  } else {
    const blockedlistHTML = [...new Set(blocked[domain])]
      .map((hostname, i) => {
        const classnames = i % 2 === 1 ? 'ph3 pv2' : 'ph3 pv2 stripe-dark';
        return `<li class="${classnames}">${hostname}</li>`;
      })
      .join('');
    blockedlist.innerHTML = blockedlistHTML;
  }
};
const disableButton = document.getElementById('disable');
const initialMessage = disableButton.value;
const setDisableButtonVal = (disabled, domain) => {
  if (disabled.indexOf(domain) >= 0) {
    disableButton.value = `Re-enable blocking for ${domain}`;
  } else {
    disableButton.value = initialMessage;
  }
};

disableButton.addEventListener('click', e => {
  e.preventDefault();
  getActiveTabDomain().then(domain => {
    browser.storage.sync.get().then(({ disabled = [], blocked = {} }) => {
      browser.storage.sync
        .set({
          disabled: xor(disabled, domain),
          blocked: { ...blocked, [domain]: [] }
        })
        .then(() => {
          browser.storage.sync.get().then(({ disabled = [], blocked = {} }) => {
            setBlockedlistHTML(blocked, domain);
            setDisableButtonVal(disabled, domain);
            browser.tabs.reload().then(() => {});
          });
        });
    });
  });
});

document.addEventListener('DOMContentLoaded', function() {
  const setPopupHTML = () => {
    getActiveTabDomain().then(domain => {
      browser.storage.sync
        .get()
        .then(({ blocked = {}, disabled = [] }) => {
          setDomainTitleHTML(domain);
          setBlockedlistHTML(blocked, domain);
          setDisableButtonVal(disabled, domain);
          setTimeout(setPopupHTML, 1500);
        })
        .then(noop);
    });
  };
  setPopupHTML();
});
