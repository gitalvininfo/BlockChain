const { BlockChain, Transaction } = require("./blockchain");
const EC = require("elliptic").ec;
const ec = new EC('secp256k1');

const myKey = ec.keyFromPrivate('23c11b567c4f7a784557344a427ddd7d4140cf0d33f6dfed706b354a5b67a33f');
const myWalletAddress = myKey.getPublic('hex');

let plCoin = new BlockChain();

const tx1 = new Transaction(myWalletAddress, 'public key goes here', 10);
tx1.signTransaction(myKey);
plCoin.addTransaction(tx1);

console.log('\n Starting the miner...');
plCoin.minePendingTransactions(myWalletAddress);

console.log('\n Balance of Alvin is ', plCoin.getBalanceOfAddress(myWalletAddress));

console.log('Is Chain valid?', plCoin.isChainValid());

