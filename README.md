# DuckDuckGo Tracker Blocker (Firefox Extension)

Before installation or development, clone the repo locally.

Then, install the `web-ext` CLI:

`yarn global add web-ext`

The extension can then be tested using temporary loading in Firefox.

## Development

To transpile the JS in development mode, run this command in another shell:

`parcel watch background.js options.html popup.html --public-url '.'`

In order to build the scripts, simply run with the `build` instead of the `watch` command:

`parcel build background.js options.html popup.html --public-url '.'`

Then, in the root of the project, run:

`web-ext run --verbose --browser-console`

To build the extension run:

`web-ext build`

## Usage

By default, this plugin blocks a large list of hosts put together by `notracking` on github.com: [notracking/hosts-blocklists](https://github.com/notracking/hosts-blocklists)

These can be rebuilt by running the following script in this repo:

`./bin/buildlist`

Which pulls in the file locally, reformats it so it's not formatted for `dnsmasq` and it can be parsed into an array in our background script, and replaces the previous `./BLOCKLIST` file with the new one.

A user can also upload their own hosts to block, by visiting the preferences page at `about:addons` and pasting in text with each host on their own line.

Example user blocklist (try on `wired.com` or `arstechnica.com`, the latter also includes a tracker on the main BLOCKLIST)

```
maps.googleapis.com
adservice.google.com
pixel.condenastdigital.com
pagead2.googlesyndication.com
```

## Roadmap

Some immediate improvements that can be made on the current extension.

- Refactor to use `async/await` everywhere possible
- Build a generalized storage update/access interface
- Normalize DOM rendering (perhaps using a library)
- Include the removing of high entropy properties from requests
- Make BLOCKLIST lookup faster (by using a binary search)
- Improve upon asynchronous communication between popup and other browser environs
