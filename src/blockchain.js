
var SHA256 = require("crypto-js/sha256");
const EC = require("elliptic").ec;
const ec = new EC('secp256k1');


class Transaction {
    constructor(fromAddress, toAddress, amount) {
        this.fromAddress = fromAddress;
        this.toAddress = toAddress;
        this.amount = amount;
    }


    calculateHash() {
        return SHA256(this.fromAddress + this.toAddress + this.amount).toString();
    }

    signTransaction(signingKey) {
        if (signingKey.getPublic('hex') !== this.fromAddress) {
            throw new Error('You cannot transactions for other wallets you idiot.');
        }

        const hashTx = this.calculateHash();
        const sig = signingKey.sign(hashTx, 'base64');
        this.signature = sig.toDER('hex');
    }

    isValid() {
        if (this.fromAddress === null) return true;

        if (!this.signature || this.signature.length === 0) {
            throw new Error('No signature in this transaction you idiot.');
        }

        const publicKey = ec.keyFromPublic(this.fromAddress, 'hex');
        return publicKey.verify(this.calculateHash(), this.signature);
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

        // console.log("Block mined: " + this.hash);
    }

    hasValidTransaction() {
        for (const tx of this.transactions) {
            console.log(tx)
            if (!tx.isValid()) {
                return false;
            }
        }

        return true;
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
        const rewardTx = new Transaction(null, miningRewardAddress, this.miningReward);
        this.pendingTransactions.push(rewardTx);

        let block = new Block(Date.now(), this.pendingTransactions, this.getLatestBlock().hash);
        block.mineBlock(this.difficulty);

        // console.log("Block successfully mined!");
        this.chain.push(block);

        this.pendingTransactions = [
            // in reality, null fromAddress is null
            // it is the duty of crypto to reward, hence no fromAddress you idiot!
            new Transaction(null, miningRewardAddress, this.miningReward)
        ]

        // console.log(this.pendingTransactions)

    }

    addTransaction(transaction) {

        if(!transaction.fromAddress || !transaction.toAddress) {
            throw new Error('Transaction must include FROM and TO address you idiot.');
        }

        if(!transaction.isValid()) {
            throw new Error('Cannot add invalid transaction.')
        }

        this.pendingTransactions.push(transaction);
        // console.log(this.pendingTransactions)
    }

    getBalanceOfAddress(address) {
        let balance = 0;

        for (const block of this.chain) {
            for (let index = 0; index < block.transactions.length; index++) {
                const tran = block.transactions[index];
                if (tran.fromAddress === address) {
                    balance -= tran.amount;
                }

                if (tran.toAddress === address) {
                    balance += tran.amount
                }
            }
        }
        return balance;
    }

    isChainValid() {
        for (let i = 1; i < this.chain.length; i++) {

            const currentBlock = this.chain[i];
            const previousBlock = this.chain[i - 1];

            if(!currentBlock.hasValidTransaction()) {
                return false;
            }

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

module.exports.BlockChain = BlockChain;
module.exports.Transaction = Transaction;