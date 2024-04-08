const config = require('../../configuration/config.json')
const Web3 = require('web3');

const SEPOLIA_RPC_URL = config?.rpc_url?.sepolia

// Connect to Ethereum network
const web3 = new Web3(SEPOLIA_RPC_URL);

async function getNonce(account) {
  return await web3.eth.getTransactionCount(account, 'pending');
}

module.exports = {
  batchRequest: async (transactionObjects, privateKey) => {
    if (transactionObjects.length > 0) {
      let count = 0;
      const batch = new web3.BatchRequest();
      while (transactionObjects.length > count) { 
        const signedTx = await web3.eth.accounts.signTransaction(transactionObjects[count], privateKey);
        await new Promise((resolve, reject) => {
          batch.add(web3.eth.sendSignedTransaction(signedTx.rawTransaction, (err, data) => { 
            if (err) {
              console.error('Error executing approve transaction:', err);
              reject(err);
            } else {
              console.log('Transaction successful:', data);
              resolve(data);
            }
          }));
        });
        count++;
      }
      await batch.execute()
    }
    return false;
  }


};