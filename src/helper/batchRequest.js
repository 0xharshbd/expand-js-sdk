const Web3 = require('web3');
const axios = require('axios')
const config = require('../../configuration/config.json');


async function getNonce(web3, account) {
  const [pendingNonce, latestNonce] = await Promise.all([
    web3.eth.getTransactionCount(account, 'pending'), 
    web3.eth.getTransactionCount(account)
  ])
  return Math.max(pendingNonce, latestNonce);
}

module.exports = {
  batchRequestEvm: async (web3, transactionObject, privateKey) => {
    try {
      const { transactions } = transactionObject;
      const account = web3.eth.accounts.privateKeyToAccount(privateKey);
      const initialNonce = await getNonce(web3, account.address);

      const batch = new web3.BatchRequest();
      const promises = [];

      for (let i = 0; i < transactions.length; i++) {
        const txParams = { ...transactions[i], nonce: web3.utils.toHex(initialNonce + i) };
        const signedTx = await web3.eth.accounts.signTransaction(txParams, privateKey);

        const promise = new Promise((resolve, reject) => {
          batch.add(web3.eth.sendSignedTransaction.request(signedTx.rawTransaction, (err, data) => {
            if (err) {
              console.error('Error executing transaction:', err);
              reject(err);
            } else {
              console.log('Transaction Sent:', data);
              resolve(data);
            }
          }));
        });
        promises.push(promise);
      }

      await batch.execute();
      const transactionHash = await Promise.all(promises);
      return transactionHash;
    } catch (error) {
      console.error('Batch request failed:', error);
      throw error;
    }
  }
};
