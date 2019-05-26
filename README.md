# Lobster Keys

_A userscript providing keybindings for [lobste.rs](https://lobste.rs)_

## Installation

[Userscripts][userscript] can be easily managed on all major browsers with extensions like [TamperMonkey][TamperMonkey].

### GreasyFork

1. Navigate to [Lobster Keys][GreasyFork] on Greasy Fork

1. Click the `Install This Script` button

1. Follow the instructions from your UserScript manager to complete the process.

### Manually

1. Navigate to [the user script](/dist/lobster-keys.js)

1. Copy the full source of the script

1. Create a new script in your manager, paste the source, and save.

## Key Bindings

On all pages with a story list (the homepage, recent, saved, search, etc.), the following keybindings are enabled:

### Page Actions

| Key | Action |
| --- | ------ |
| `[` | Open Previous Page |
| `]` | Open Next Page |
| `J` | Select Next Story |
| `K` | Select Previous Story |

### Story Actions

> Only apply with a story selected

| Key | Action |
| --- | ------ |
| `Enter` | Open Story URL |
| `A` | Open Author/Poster Profile |
| `C` | Open Comments |
| `D` | Open Domain Search |
| `F` | Open Flag Dropdown |
| `H` | Toggle Hide |
| `S` | Toggle Save |
| `U` | Toggle Upvote |

## Development

```sh
# bootstrap
npm install

# tests
npm run test

# build
npm run build

# watch mode
npm run build -- -w
```

[GreasyFork]: TBD
[TamperMonkey]: https://www.tampermonkey.net/
[userscript]: https://en.wikipedia.org/wiki/Userscript
