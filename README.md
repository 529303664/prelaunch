# Prelaunch for Apron

# Apron ERC20

The contract has been deployed at [0x](https://etherscan.io/address/0x).

# Prerequisites

## Install dependencies

Prefer node.js v12.16.2

```bash
yarn
```

## Deploy

```bash
truffle migrate --network mainnet
```

## Verify on Etherscan

```bash
truffle run verify PHAToken --network mainnet
```

## Aprove Airdrop

```bash
truffle console --network mainnet
```

Then in the console:

```js
pha = await PHAToken.deployed()
airdrop = await MerkleAirdrop.deployed()
UNIT = new web3.utils.BN('1000000000000000000')
await pha.approve(airdrop.address, UNIT.muln(10000))
```

## Approve MultiSend.co

```bash
truffle console --network mainnet
```

Then in the console:
```js
pha = await PHAToken.deployed()
UNIT = new web3.utils.BN('1000000000000000000')
await pha.approve('0x941f40c2955ee09ba638409f67ef27c531fc055c', UNIT.muln(10000))
```