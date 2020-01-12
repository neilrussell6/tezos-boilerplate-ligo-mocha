Tezos boilerplate : Pascal LiGo + Mocha
===

> Boilerplate for developing Tezos smart contracts with Pascal Ligo and testing them with Ligo CLI and Mocha

Prerequisites
---

### Ligo

```bash
curl https://gitlab.com/ligolang/ligo/raw/dev/scripts/installer.sh | bash -s "next"
```

Quick Start
---

 - ``npm i`` Install Node dependencies

Test
---

 - ``npm run test`` Run all tests
 - ``npm run test:watch`` Run all tests in watch mode

Compile
---

 - ``npm run compile -- "src/contracts/<path to ligo file>"`` Compile a single Ligo smart contract
 - ``npm run compile:all`` Compile all Ligo smart contracts under ``src/contracts``
 - ``npm run compile:all:watch`` Compile all Ligo smart contracts under ``src/contracts`` whenever they change

Issues
---

Ligo CLI is not showing us the error message from failWith,
so we can't test failure paths properly using the approach in this boilerplate.

TODO: find a solution to this ^

Additional Docs
---

 - [IDE Setup](docs/ide-intellij-python.md)
