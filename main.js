
var SHA256 = require("crypto-js/sha256");


class Transaction {
    constructor(fromAddress, toAddress, amount) {
        this.fromAddress = fromAddress;
        this.toAddress = toAddress;
        this.amount = amount;
    }
}


class Block {

    constructor(timeStamp, transactions, previousHash = "") {
        this.timeStamp = timeStamp;
        this.transactions = transactions;
        this.previousHash = previousHash;
        this.hash = this.calculateHash();
        this.nonce = 0;
    }

    calculateHash() {
        return SHA256(this.previousHash + this.timeStamp +
            JSON.stringify(this.transactions) + this.nonce).toString();
    }

    mineBlock(difficulty) {
        while (this.hash.substring(0, difficulty) !== Array(difficulty + 1).join("0")) {
            this.nonce++;
            this.hash = this.calculateHash();
        }

        console.log("Block mined: " + this.hash);
    }
}

class BlockChain {

    constructor() {
        this.chain = [this.createGenesisBlock()];
        this.difficulty = 2;
        this.pendingTransactions = [];
        this.miningReward = 100;
    }

    createGenesisBlock() {
        return new Block("01/01/2017", { amount: 4 }, "0");
    }

    getLatestBlock() {
        return this.chain[this.chain.length - 1];
    }

    minePendingTransactions(miningRewardAddress) {
        let block = new Block(Date.now(), this.pendingTransactions);
        block.mineBlock(this.difficulty);

        console.log("Block successfully mined!");
        this.chain.push(block);

        this.pendingTransactions = [
            // in reality, null fromAddress is null
            // it is the duty of crypto to reward, hence no fromAddress you idiot!
            new Transaction(null, miningRewardAddress, this.miningReward)
        ]

    }

    createTransaction(transaction) {
        this.pendingTransactions.push(transaction);
    }

    getBalanceOfAddress(address) {
        let balance = 0;

        for (const block of this.chain) {
            for (const trans of block.transactions) {
                if (trans.fromAddress === address) {
                    balance -= trans.amount;
                }

                if (trans.toAddress === address) {
                    balance += trans.amout
                }
            }
        }
        return balance;
    }

    // addBlock(newBlock) {
    //     // get the previous hash in the chain;
    //     newBlock.previousHash = this.getLatestBlock().hash;
    //     // newBlock.hash = newBlock.calculateHash();
    //     newBlock.mineBlock(this.difficulty);
    //     this.chain.push(newBlock);
    // }

    isChainValid() {
        for (let i = 1; i < this.chain.length; i++) {

            const currentBlock = this.chain[i];
            const previousBlock = this.chain[i - 1];

            // if ang current hash is not equal to the calculated
            // current hash
            if (currentBlock.hash !== currentBlock.calculateHash()) {
                return false;
            }

            // if ang current block iya previous block not equal
            // to the actual previous hash
            if (currentBlock.previousHash !== previousBlock.hash) {
                return false;
            }
        }

        return true;
    }
}



let plCoin = new BlockChain();

plCoin.createTransaction(new Transaction('address1', 'address2', 100));
plCoin.createTransaction(new Transaction('address2', 'address1', 50));


// store transaction to pending transactions
// 10 minutes per block you idiot.
console.log('\n Starting the miner...');
plCoin.minePendingTransactions('alvin-address');

console.log('\n Balance of Alvin is ', plCoin.getBalanceOfAddress('alvin-address'));


console.log('\n Starting the miner again...');
plCoin.minePendingTransactions('alvin-address');
console.log('\n Balance of Alvin is ', plCoin.getBalanceOfAddress('alvin-address'));







// console.log("Mining block 1...")
// plCoin.addBlock(new Block(0, "01/01/2017", { amount: 4 }))

// console.log("Mining block 2...")
// plCoin.addBlock(new Block(1, "02/01/2017", { amount: 10 }))

// // hacker
// plCoin.chain[1].transactions = { amount: 100 }
// // console.log(JSON.stringify(plCoin, null, 4));



// 1mb limit per block of transaction
// miners choose transaction which to include in pending transaction