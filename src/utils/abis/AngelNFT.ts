export const AngelNFTABI = [
  {
    "type": "constructor",
    "name": "",
    "inputs": [],
    "outputs": [],
    "stateMutability": "nonpayable"
  },
  {
    "type": "event",
    "name": "ClaimConditionsUpdated",
    "inputs": [
      {
        "type": "uint256",
        "name": "tokenId",
        "indexed": true
      }
    ],
    "outputs": [],
    "anonymous": false
  },
  {
    "type": "event",
    "name": "TokensClaimed",
    "inputs": [
      {
        "type": "address",
        "name": "claimer",
        "indexed": true
      },
      {
        "type": "address",
        "name": "receiver",
        "indexed": true
      },
      {
        "type": "uint256",
        "name": "tokenId",
        "indexed": true
      },
      {
        "type": "uint256",
        "name": "quantityClaimed",
        "indexed": false
      }
    ],
    "outputs": [],
    "anonymous": false
  },
  {
    "type": "function",
    "name": "claim",
    "inputs": [
      {
        "type": "uint256",
        "name": "_tokenId"
      },
      {
        "type": "uint256",
        "name": "_quantity"
      },
      {
        "type": "bytes32[]",
        "name": "_proofs"
      }
    ],
    "outputs": [],
    "stateMutability": "nonpayable"
  },
  {
    "type": "function",
    "name": "setClaimConditions",
    "inputs": [
      {
        "type": "uint256",
        "name": "_tokenId"
      },
      {
        "type": "tuple[]",
        "name": "_conditions",
        "components": [
          {
            "type": "uint256",
            "name": "maxClaimableSupply"
          },
          {
            "type": "uint256",
            "name": "startTimestamp"
          },
          {
            "type": "bytes32",
            "name": "merkleRoot"
          }
        ]
      },
      {
        "type": "bool",
        "name": "_resetClaimEligibility"
      }
    ],
    "outputs": [],
    "stateMutability": "nonpayable"
  }
]; 