const MerkleAirdrop = artifacts.require("MerkleAirdrop");
const Token = artifacts.require("ERC20Token");

const fs = require('fs');

module.exports = async function (deployer, network, accounts) {

  deployer.then(async () => {
    await deployer.deploy(MerkleAirdrop);

    const token = await Token.deployed();
    const airdrop = await MerkleAirdrop.deployed();

    let contracts = {
      tokenAddress: token.address,
      airdropAddress: airdrop.address
    };

    fs.writeFileSync('./contracts.txt', JSON.stringify(contracts),  {encoding: 'utf-8'});


    const airdropBuild = require('../build/contracts/MerkleAirdrop');

    fs.writeFileSync('./MerkleAirdrop.abi.json', JSON.stringify(airdropBuild.abi),  {encoding: 'utf-8'});

    await airdrop.setToken(token.address, accounts[0]);
  })
};
