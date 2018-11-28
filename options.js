import { makeLogger } from './utils';
const { onError } = makeLogger('OPT');

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
