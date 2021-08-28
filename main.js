
var SHA256 = require("crypto-js/sha256");


class Block {

    constructor(index, timeStamp, data, previousHash = "") {
        this.index = index;
        this.timeStamp = timeStamp;
        this.data = data;
        this.previousHash = previousHash;
        this.hash = this.calculateHash();
        this.nonce = 0;
    }

    calculateHash() {
        return SHA256(this.index + this.previousHash + this.timeStamp +
            JSON.stringify(this.data) + this.nonce).toString();
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
        this.difficulty = 5;
    }

    createGenesisBlock() {
        return new Block(0, "01/01/2017", { amount: 4 }, "0");
    }

    getLatestBlock() {
        return this.chain[this.chain.length - 1];
    }

    addBlock(newBlock) {
        // get the previous hash in the chain;
        newBlock.previousHash = this.getLatestBlock().hash;
        // newBlock.hash = newBlock.calculateHash();
        newBlock.mineBlock(this.difficulty);
        this.chain.push(newBlock);
    }

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
console.log("Mining block 1...")
plCoin.addBlock(new Block(0, "01/01/2017", { amount: 4 }))

console.log("Mining block 2...")
plCoin.addBlock(new Block(1, "02/01/2017", { amount: 10 }))






// hacker
plCoin.chain[1].data = { amount: 100 }
// console.log(JSON.stringify(plCoin, null, 4));