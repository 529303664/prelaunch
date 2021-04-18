// USAGE:
//  WORKDIR='./tmp/md1' truffle exce ./scripts/checkMerkleAirdrop.js --network development
//  WORKDIR='./tmp/md1' truffle exce ./scripts/checkMerkleAirdrop.js --network kovan
//  WORKDIR='./tmp/prod/md1' truffle exce ./scripts/checkMerkleAirdrop.js --network mainnet

require('dotenv').config()

const MerkleAirdrop = artifacts.require('MerkleAirdrop');
const ERC20Token = artifacts.require('ERC20Token');


async function main() {

    try {
        const token = await ERC20Token.deployed();
        const airdrop = await MerkleAirdrop.deployed();
        UNIT = new web3.utils.BN('1000000000000000000');
        await token.approve(airdrop.address, UNIT.muln(1000000));
        console.log('Done');
    } catch (err) {
        console.log(err);
        throw err;
    }
}

module.exports = async function (callback) {
    try {
        await main();
        callback();
    } catch (err) {
        console.error(err.message);
        callback(err);
    }
}