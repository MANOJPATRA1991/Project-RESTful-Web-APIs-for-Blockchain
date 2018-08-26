const level = require('level');
const chainDB = './chaindata';

class LevelSandbox {
  constructor() {
    this.db = level(chainDB);
  }
  
  getAllBlockHash() {
  	let self = this;
    let i = -1;
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

module.exports = LevelSandbox;