const makeExtensionLogger = (ext = '', mod = '') => {
  const log = (...args) =>
    console.log.apply(undefined, [[ext, mod].join('-'), ...args]);
  const err = (...args) => log(`Error: `, args);
  const onError = e => err(e);

  return {
    log,
    err,
    onError
  };
};

export const makeLogger = makeExtensionLogger.bind(undefined, 'DDG');

const log = makeLogger('UTL');

const makeGetHostname = () => {
  let parser = document.createElement('a');
  const getHostname = url => {
    parser.href = url;
    return parser.hostname;
  };
  return getHostname;
};

export const getHostname = makeGetHostname();

export const noop = () => undefined;

export const xor = (arr, val) => {
  const arrClone = arr.slice(0);
  const index = arrClone.indexOf(val);
  if (index >= 0) {
    arrClone.splice(index, 1);
    return arrClone;
  }
  return arrClone.concat([val]);
};

export function getActiveTabDomain() {
  return new Promise(resolve => {
    browser.tabs.query(
      {
        active: true,
        currentWindow: true,
        windowType: 'normal'
      },
      tabs => {
        const [url] = tabs.map(tab => tab.url);
        resolve(getHostname(url));
      }
    );
  });
}

const util = {
  xor,
  noop,
  makeLogger,
  getHostname,
  getActiveTabDomain
};

export { util as default };
