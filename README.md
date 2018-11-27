# DuckDuckGo Tracker Blocker (Firefox Extension)

## Installation

## Development

First install the `web-ext` CLI:

`yarn global add web-ext`

Then, in the root of the project, run:

`web-ext run --verbose --browser-console`

## Usage

By default, this plugin blocks a large list of hosts put together by `notracking` on github.com: [http://github.com/notracking](notracking/hosts)

These can be rebuilt by running the following script in this repo:

`./bin/buildlist`

Which pulls in the file locally, reformats it so it's not formatted for `dnsmasq` and it can be parsed into an array in our background script, and replaces the previous `./BLOCKLIST` file with the new one.

A user can also upload their own hosts to block, by visiting the preferences page at `about:addons` and pasting in text with each host on their own line.

Example user blocklist (try on wired.com)

```
maps.googleapis.com
twitter.com
facebook.com
pixel.condenastdigital.com
api.viafoura.co
pagead2.googlesyndication.com
```
