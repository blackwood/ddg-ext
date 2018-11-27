const log = (...args) => console.log.apply(undefined, ['DDG-OPT', ...args]);
const err = (...args) => log(`Error: `, args);
const onError = e => err(e);

function saveOptions(e) {
  e.preventDefault();
  browser.storage.sync.set({
    userblocklist: document.querySelector('#user-blocklist').value
  });
}

function restoreOptions() {
  function setBlocklist(result) {
    document.querySelector('#user-blocklist').value =
      result.userblocklist || '';
  }

  browser.storage.sync.get('userblocklist').then(setBlocklist, onError);
}

document.addEventListener('DOMContentLoaded', restoreOptions);
document.querySelector('form').addEventListener('submit', saveOptions);
