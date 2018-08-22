const level = require('level');
const SHA256 = require('crypto-js/sha256');
const chainDB = './chaindata';

class LevelSandbox {
  constructor() {
    this.db = level(chainDB);
  }
  
  getAllBlockHash() {
  	let self = this;
    let i = 0;
    return new Promise(function(resolve, reject) {
      self.db.createKeyStream()
      .on('data', function(data) {
        i++;
      })
      .on('error', function(err) {
        reject(err);
      })
      .on('close', function() {
        resolve(i);
      });
    });
  }

  async addLevelDBData(key, value) {
    try {
      await this.db.put(key, value);
    } catch(err) {
      console.log('Block ' + key + ' submission failed', err);
    }
  }

  async getLevelDBData(key) {
    try {
      let val = await this.db.get(key);
      console.log(val);
      return val;
    } catch(err) {
      console.log('Not found!', err);
    }
  }
}

class Block{
	constructor(data) {
    this.hash = "";
    this.height = 0;
    this.body = data;
    this.time = 0;
    this.previousBlockHash = "";
  }
}

class Blockchain{
  constructor(){
    this.chain = new LevelSandbox();
    this.checkHeightOfChain();
  }

  async checkHeightOfChain() {
    let height = await this.getBlockHeight();
    if (height === 0) {
      this.addBlock(new Block("First block in the chain - Genesis block"));
    }
  }

  // Add new block
  async addBlock(newBlock){
    // Block height
    let height = await this.getBlockHeight();
    newBlock.height = height + 1;
    
    // UTC timestamp
    newBlock.time = new Date().getTime().toString().slice(0,-3);
    // previous block hash
    if(newBlock.height > 1) {
      let prevHash = this.getBlock(newBlock.height-1).hash;
      newBlock.previousBlockHash = prevHash;
    } else {
      newBlock.previousBlockHash = 0;
    }
    
    // Block hash with SHA256 using newBlock and converting to a string
    newBlock.hash = SHA256(JSON.stringify(newBlock)).toString();
    

    // Adding block object to chain
    this.chain.addLevelDBData(newBlock.height, JSON.stringify(newBlock).toString());
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
      let block = await this.chain.getLevelDBData(blockHeight);
      return JSON.parse(JSON.stringify(block));
    }

    // validate block
    async validateBlock(blockHeight){
      // get block object
      let block = await this.getBlock(blockHeight);
      let parsedBlock = JSON.parse(block);
      // get block hash
      let blockHash = parsedBlock.hash;
      // remove block hash to test block integrity
      parsedBlock.hash = '';
      // generate block hash
      let validBlockHash = SHA256(JSON.stringify(parsedBlock)).toString();
      // Compare
      if (blockHash===validBlockHash) {
          return true;
        } else {
          console.log('Block #'+blockHeight+' invalid hash:\n'+blockHash+'<>'+validBlockHash);
          return false;
        }
    }

    // Validate blockchain
    validateChain(){
      let errorLog = [];
      for (let i = 1; i < this.getBlockHeight(); i++) {
        // validate block
        if (!this.validateBlock(i)) errorLog.push(i);
        // compare blocks hash link
        let blockHash = this.getBlock(i).hash;
        let previousHash = this.getBlock(i+1).previousBlockHash;
        if (blockHash !== previousHash) {
          errorLog.push(i);
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
