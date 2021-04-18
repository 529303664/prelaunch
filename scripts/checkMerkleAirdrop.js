// USAGE:
//  WORKDIR='./tmp/md1' truffle exce ./scripts/checkMerkleAirdrop.js --network development
//  WORKDIR='./tmp/md1' truffle exce ./scripts/checkMerkleAirdrop.js --network kovan
//  WORKDIR='./tmp/prod/md1' truffle exce ./scripts/checkMerkleAirdrop.js --network mainnet

require('dotenv').config()

const fs = require('fs');
const parse = require('csv-parse/lib/sync');
const axios = require('axios');

const { merklize, toMaterializable } = require('@apron/merkledrop-lib');

const MerkleAirdrop = artifacts.require('MerkleAirdrop');
const Token = artifacts.require('PHAToken');

const workdir = process.env.WORKDIR;


const IPFS_BASES = [
    'https://10.via0.com/ipfs',
    'https://ipfs.io/ipfs',
    'https://ipfs.leiyun.org/ipfs',
    'https://cloudflare-ipfs.com/ipfs',
];

const outPlansWithStatus = `${workdir}/ttttt-plans-status.json`;

function loadcsv(path) {
    const input = fs.readFileSync(path, 'utf-8');
    return parse(input, {
        columns: true,
        skip_empty_lines: true
    })
}


async function agumentedIpfsGet(hash) {
    const promises = IPFS_BASES.map(ipfsBase => axios.get(`${ipfsBase}/${hash}`));
    if (Promise.any) {
        return await Promise.any(promises);
    } else {
        console.warn('No Promise.any, fallback to p-any');
        return await pAny(promises);
    }
}

async function getAirdropPlan(uri) {
    const hash = uri.replace('/ipfs/', '');
    const resp = await agumentedIpfsGet(hash);

    // console.log(resp.data);

    return resp.data;
}

async function getAirdropLists(contract) {
    console.log('### 1');
    const numAirdrop = await contract.methods.airdropsCount().call();

    console.log('Drop number : ', numAirdrop);

    const uriPromises = []
    console.log('### 2');
    for (let i = 1; i <= numAirdrop; i++) {
        uriPromises.push(contract.methods.airdrops(i).call());
    }
    const airdrops = await Promise.all(uriPromises);
    console.log('airdrops', airdrops);

    const plans = await Promise.all(
        airdrops.map(a => getAirdropPlan(a.dataURI))
    );
    const plansWithStatus = plans.map((a, idx) => {
        return { ...a, paused: airdrops[idx].paused };
    });

    console.log('plans', plansWithStatus);
    return plansWithStatus;
}

async function checkAwarded(contract, id, address) {
    return await contract.methods.awarded(id, address).call();
}

async function main() {

    try {
        const drop = await MerkleAirdrop.deployed();

        const plansWithStatus = await getAirdropLists(drop.contract);
        console.log(plansWithStatus);


        const pha = await Token.deployed();
        const [account] = await web3.eth.getAccounts();

        const curDrops = await drop.airdropsCount();
        console.log('Current airdrops:', curDrops.toNumber());

        // console.log(airdropData);

        const _myAwards = [];
        for (let plan of plansWithStatus) {
            for (let award of plan.awards) {
                _myAwards.push({
                    ...award,
                    id: plan.id,
                    paused: plan.paused,
                })
            }
        }

        const awarded = await Promise.all(_myAwards.map(a => checkAwarded(drop.contract, a.id, a.address)));

        _myAwards.forEach((a, idx) => {
            a.awarded = awarded[idx];
        });
        console.log(_myAwards);

        // save plansWithStatusv
        const plansWithStatusJSON = JSON.stringify(plansWithStatus);
        console.log(plansWithStatusJSON);
        fs.writeFileSync(outPlansWithStatus, plansWithStatusJSON, { encoding: 'utf-8' });

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