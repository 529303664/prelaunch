const MerkleAirdrop = artifacts.require("MerkleAirdrop");
const Token = artifacts.require("ERC20Token");

module.exports = async function (deployer, network, accounts) {

  deployer.then(async () => {
    await deployer.deploy(MerkleAirdrop);

    const token = await Token.deployed();
    const airdrop = await MerkleAirdrop.deployed();

    await airdrop.setToken(token.address, accounts[0]);
  })
};
