const network = 'kovan';
const constants = {
    mainnet: {
        etherscanBase: 'https://etherscan.io',
        airdropAddress: '',
    },
    kovan: {
        etherscanBase: 'https://kovan.etherscan.io',
        airdropAddress: '0xd653d80c02c726BcE871B522B79Ae7e20E8c3A78'
    }
};

function loadMerkleAirdropContract(web3) {
    return new web3.eth.Contract(merkleAirdropABI, merkleAirdropAddress);
}

const etherscanBase = constants[network].etherscanBase;
const merkleAirdropAddress = constants[network].airdropAddress;
const merkleAirdropABI = [
    {
        "anonymous": false,
        "inputs": [
        {
            "indexed": false,
            "internalType": "uint256",
            "name": "id",
            "type": "uint256"
        },
        {
            "indexed": false,
            "internalType": "address",
            "name": "recipient",
            "type": "address"
        },
        {
            "indexed": false,
            "internalType": "uint256",
            "name": "amount",
            "type": "uint256"
        }
        ],
        "name": "Award",
        "type": "event"
    },
    {
        "anonymous": false,
        "inputs": [
        {
            "indexed": true,
            "internalType": "address",
            "name": "previousOwner",
            "type": "address"
        },
        {
            "indexed": true,
            "internalType": "address",
            "name": "newOwner",
            "type": "address"
        }
        ],
        "name": "OwnershipTransferred",
        "type": "event"
    },
    {
        "anonymous": false,
        "inputs": [
        {
            "indexed": false,
            "internalType": "uint256",
            "name": "id",
            "type": "uint256"
        }
        ],
        "name": "Start",
        "type": "event"
    },
    {
        "constant": true,
        "inputs": [
        {
            "internalType": "uint256",
            "name": "",
            "type": "uint256"
        }
        ],
        "name": "airdrops",
        "outputs": [
        {
            "internalType": "bytes32",
            "name": "root",
            "type": "bytes32"
        },
        {
            "internalType": "string",
            "name": "dataURI",
            "type": "string"
        }
        ],
        "payable": false,
        "stateMutability": "view",
        "type": "function"
    },
    {
        "constant": true,
        "inputs": [],
        "name": "airdropsCount",
        "outputs": [
        {
            "internalType": "uint256",
            "name": "",
            "type": "uint256"
        }
        ],
        "payable": false,
        "stateMutability": "view",
        "type": "function"
    },
    {
        "constant": true,
        "inputs": [],
        "name": "approver",
        "outputs": [
        {
            "internalType": "address",
            "name": "",
            "type": "address"
        }
        ],
        "payable": false,
        "stateMutability": "view",
        "type": "function"
    },
    {
        "constant": true,
        "inputs": [],
        "name": "isOwner",
        "outputs": [
        {
            "internalType": "bool",
            "name": "",
            "type": "bool"
        }
        ],
        "payable": false,
        "stateMutability": "view",
        "type": "function"
    },
    {
        "constant": true,
        "inputs": [],
        "name": "owner",
        "outputs": [
        {
            "internalType": "address",
            "name": "",
            "type": "address"
        }
        ],
        "payable": false,
        "stateMutability": "view",
        "type": "function"
    },
    {
        "constant": false,
        "inputs": [],
        "name": "renounceOwnership",
        "outputs": [],
        "payable": false,
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "constant": true,
        "inputs": [],
        "name": "token",
        "outputs": [
        {
            "internalType": "contract IERC20",
            "name": "",
            "type": "address"
        }
        ],
        "payable": false,
        "stateMutability": "view",
        "type": "function"
    },
    {
        "constant": false,
        "inputs": [
        {
            "internalType": "address",
            "name": "newOwner",
            "type": "address"
        }
        ],
        "name": "transferOwnership",
        "outputs": [],
        "payable": false,
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "constant": false,
        "inputs": [
        {
            "internalType": "address",
            "name": "_token",
            "type": "address"
        },
        {
            "internalType": "address",
            "name": "_approver",
            "type": "address"
        }
        ],
        "name": "setToken",
        "outputs": [],
        "payable": false,
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "constant": false,
        "inputs": [
        {
            "internalType": "bytes32",
            "name": "_root",
            "type": "bytes32"
        },
        {
            "internalType": "string",
            "name": "_dataURI",
            "type": "string"
        }
        ],
        "name": "start",
        "outputs": [],
        "payable": false,
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "constant": false,
        "inputs": [
        {
            "internalType": "uint256",
            "name": "_id",
            "type": "uint256"
        },
        {
            "internalType": "address",
            "name": "_recipient",
            "type": "address"
        },
        {
            "internalType": "uint256",
            "name": "_amount",
            "type": "uint256"
        },
        {
            "internalType": "bytes32[]",
            "name": "_proof",
            "type": "bytes32[]"
        }
        ],
        "name": "award",
        "outputs": [],
        "payable": false,
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "constant": false,
        "inputs": [
        {
            "internalType": "uint256[]",
            "name": "_ids",
            "type": "uint256[]"
        },
        {
            "internalType": "address",
            "name": "_recipient",
            "type": "address"
        },
        {
            "internalType": "uint256[]",
            "name": "_amounts",
            "type": "uint256[]"
        },
        {
            "internalType": "bytes",
            "name": "_proofs",
            "type": "bytes"
        },
        {
            "internalType": "uint256[]",
            "name": "_proofLengths",
            "type": "uint256[]"
        }
        ],
        "name": "awardFromMany",
        "outputs": [],
        "payable": false,
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "constant": true,
        "inputs": [
        {
            "internalType": "bytes",
            "name": "_proofs",
            "type": "bytes"
        },
        {
            "internalType": "uint256",
            "name": "_marker",
            "type": "uint256"
        },
        {
            "internalType": "uint256",
            "name": "proofLength",
            "type": "uint256"
        }
        ],
        "name": "extractProof",
        "outputs": [
        {
            "internalType": "bytes32[]",
            "name": "proof",
            "type": "bytes32[]"
        }
        ],
        "payable": false,
        "stateMutability": "pure",
        "type": "function"
    },
    {
        "constant": true,
        "inputs": [
        {
            "internalType": "bytes32",
            "name": "root",
            "type": "bytes32"
        },
        {
            "internalType": "bytes32[]",
            "name": "proof",
            "type": "bytes32[]"
        },
        {
            "internalType": "bytes32",
            "name": "hash",
            "type": "bytes32"
        }
        ],
        "name": "validate",
        "outputs": [
        {
            "internalType": "bool",
            "name": "",
            "type": "bool"
        }
        ],
        "payable": false,
        "stateMutability": "pure",
        "type": "function"
    },
    {
        "constant": true,
        "inputs": [
        {
            "internalType": "uint256",
            "name": "_id",
            "type": "uint256"
        },
        {
            "internalType": "address",
            "name": "_recipient",
            "type": "address"
        }
        ],
        "name": "awarded",
        "outputs": [
        {
            "internalType": "bool",
            "name": "",
            "type": "bool"
        }
        ],
        "payable": false,
        "stateMutability": "view",
        "type": "function"
    }
];

export {
    network,
    etherscanBase,
    merkleAirdropAddress,
    merkleAirdropABI,
    loadMerkleAirdropContract
};