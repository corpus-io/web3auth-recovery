# Recovering a web3auth private key from key shares

This is a frontend to a script that recovers private keys from key shares. It uses the same format as web3auth. The user is required to provide the key shares manually.

## setup

```bash
yarn install
yarn start
```

## usage

Some information is given in the UI. This includes a working example.

## credits

Hacked for [tokenize.it](https://www.tokenize.it/) by [malteish](https://github.com/malteish) in 2023.

Relevant code (e.g. in recover.ts) was taken from [web3auth's](https://web3auth.io) Shamir's secret sharing scheme [implementation](https://github.com/tkey/tkey/blob/master/packages/core/src/lagrangeInterpolatePolynomial.ts#L82).

## license

licensed under the MIT license
