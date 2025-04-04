const Web3 = require('web3');
const axios = require('axios')
const config = require('../../configuration/config.json');


async function getNonce(web3,account) {
  const pendingNonce = await web3.eth.getTransactionCount(account, 'pending');
  const latestNonce = await web3.eth.getTransactionCount(account);
  return Math.max(pendingNonce, latestNonce);
}

module.exports = {
  batchRequest: async (transactionObjects, privateKey, account) => {
    if (transactionObjects.length === 0) return false;

    const chainId = transactionObjects[0]["chainId"];
    const apiKey = process.env.xApiKey;

    // Get the rpc to initialize web3
    let rpc;
    try {
      const publicRpcResponse = await axios.get(`${config.url.apiurl}chain/getpublicrpc?chainId=${chainId}`, {
        headers: { 
          'x-api-key': apiKey
        }
      });
      if (publicRpcResponse && publicRpcResponse?.data?.status === 200) {
        rpc = publicRpcResponse?.data?.data?.rpc;
      }
    } catch (error) {
      console.log("Error getting RPC url - ", error);
      return false;
    }

    // Web3 Initialized
    const web3 = new Web3(rpc);

    try {
      const initialNonce = await getNonce(web3, account);
      console.log("Initial nonce --", initialNonce);

      const batch = new web3.BatchRequest();
      const promises = [];

      for (let i = 0; i < transactionObjects.length; i++) {
        const txParams = { ...transactionObjects[i], nonce: web3.utils.toHex(initialNonce + i) };
        const signedTx = await web3.eth.accounts.signTransaction(txParams, privateKey);
        console.log('Transaction Signed:', signedTx.transactionHash);

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
      await Promise.all(promises);
      return true;
    } catch (error) {
      console.error('Batch request failed:', error);
      throw error;
    }
  }
};
