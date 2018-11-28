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

const util = {
  noop,
  makeLogger,
  getHostname
};

export { util as default };
