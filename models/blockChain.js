const Block = require('./block');
const LevelSandbox = require('./levelSandbox');
const SHA256 = require('crypto-js/sha256');

class Blockchain{
  constructor(){
    this.chain = new LevelSandbox();
    this.checkHeightOfChain();
  }

  async checkHeightOfChain() {
    let height = await this.getBlockHeight();
    if (height === -1) {
      this.addBlock("First block in the chain - Genesis block");
    }
  }

  // Add new block
  async addBlock(newBlockData){
    let newBlock = new Block(newBlockData);
    // Block height
    let height = await this.getBlockHeight();
    newBlock.height = height + 1;
    
    // UTC timestamp
    newBlock.time = new Date().getTime().toString().slice(0,-3);
    // previous block hash
    if(newBlock.height > 0) {
      let prevHash = (await this.getBlock(newBlock.height-1)).hash;
      newBlock.previousBlockHash = prevHash;
    } else {
      newBlock.previousBlockHash = 0;
    }
    
    // Block hash with SHA256 using newBlock and converting to a string
    newBlock.hash = SHA256(JSON.stringify(newBlock)).toString();
    

    // Adding block object to chain
    return this.chain.addLevelDBData(newBlock.height, JSON.stringify(newBlock));
  }

  // Get block height
  async getBlockHeight(){
  	try {
      let data = await this.chain.getAllBlockHash();
  		return data;
	  } catch (err) {
        throw TypeError("An error occured");
    };
  }

  // get block
  async getBlock(blockHeight){
    // return object as a single string
    try {
      let block = await this.chain.getLevelDBData(blockHeight);
      return JSON.parse(block);
    } catch (err) {
      throw TypeError("Block not found in the database.");
    }
  }

  // validate block
  async validateBlock(blockHeight){
    // get block object
    let block = await this.getBlock(blockHeight);
    // get block hash
    let blockHash = block.hash;
    // remove block hash to test block integrity
    block.hash = '';
    // generate block hash
    let validBlockHash = SHA256(JSON.stringify(block)).toString();
    // Compare
    if (blockHash===validBlockHash) {
        return true;
      } else {
        console.log('Block #'+blockHeight+' invalid hash:\n'+blockHash+'<>'+validBlockHash);
        return false;
      }
  }

  // Validate blockchain
  async validateChain(){
    let errorLog = [];
    let height = await this.getBlockHeight();
    for (let i = 0; i <= height; i++) {
      console.log("Block is: ", await this.getBlock(i));
      // validate block
      if (!(await this.validateBlock(i))) errorLog.push(i);
      // compare blocks hash link
      if (i+1 <= height) {
        let blockHash = (await this.getBlock(i)).hash;
        let previousHash = (await this.getBlock(i+1)).previousBlockHash;
        if (blockHash !== previousHash) {
          errorLog.push(i);
        }
      }
    }
    if (errorLog.length > 0) {
      console.log('Block errors = ' + errorLog.length);
      console.log('Blocks: '+errorLog);
    } else {
      console.log('No errors detected');
    }
  }
}

let blockChain = new Blockchain();

module.exports = blockChain;