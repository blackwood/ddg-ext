const log = (...args) => console.log.apply(undefined, ['DDG', ...args]);

const blocklist = ['www.google-analytics.com', 'pagead2.googlesyndication.com'];

const handleBeforeRequest = request => {
  const url = new URL(request.url);
  const { hostname } = url;
  if (blocklist.indexOf(hostname) > -1) {
    log(`BLOCKED: ${hostname}`);
    return {
      cancel: true
    };
  }
};

browser.webRequest.onBeforeRequest.addListener(
  handleBeforeRequest,
  {
    urls: ['<all_urls>']
  },
  ['blocking']
);
