const Web3 = require('web3');
const axios = require('axios');
const SERVER_URL = "https://api.expand.network/";

// Create an Axios instance with default headers
async function initializeAxios(xAPIKey){
  const axiosInstance = axios.create({
    baseURL: SERVER_URL,
    headers: {
      'x-api-key': xAPIKey,
    },
  });
  return axiosInstance
}

module.exports = {
  approveAndSwap: async (options) => {
    const { privateKey, xApiKey, chainId, from, path, gas, amountIn } = options;
    let swapParams = options

    delete swapParams.xApiKey
    delete swapParams.privateKey
    delete swapParams.chainId
    const axiosInstance = await initializeAxios(xApiKey);
    
    const headers = { 'x-api-key': xApiKey };
    let publicRpcResponse, rpc;

    try {
      publicRpcResponse = await axiosInstance.get(`chain/getpublicrpc?chainId=${chainId}`);
      if (publicRpcResponse && publicRpcResponse?.data?.status === 200)
        rpc = publicRpcResponse?.data?.data?.rpc
    } catch (error) {
      console.log("Error getting RPC url - ", error)
      return;
    }

    const web3 = new Web3(rpc);
    let nonce = await web3.eth.getTransactionCount(from, 'pending');;

    try {
      // Step 1: Swap tokens
      const swapResponse = await axiosInstance.post('dex/swap', swapParams);

      // console.log('Swap response:', swapResponse);

      const { to: spender, chainId } = swapResponse?.data?.data;

      if (!spender)
        return

      // Step 2: Check allowance
      const allowanceResponse = await axiosInstance.get('fungibletoken/getuserallowance', {
        params: {
          owner: from,
          spender,
          tokenAddress: path[0],
        },
      });

      const allowance = allowanceResponse?.data?.data?.allowance || "0";

      let approvalResponse = null;

      if (allowance < amountIn) {
        // Calculate the amount to approve
        const amountToApprove = parseInt(amountIn) - parseInt(allowance);

        // Step 3: If allowance is not enough, approve token
        approvalResponse = await axiosInstance.post('fungibletoken/approve', {
          from,
          tokenAddress: path[0],
          amount: amountToApprove.toString(),
          to: spender,
          gas,
          chainId,
        });

      }

      const batch = new web3.BatchRequest();

      if (approvalResponse?.data?.status === 200) {
        const approvalData = approvalResponse.data.data;
        const approveTxObject = {
          chainId: approvalData.chainId,
          from,
          to: approvalData.to,
          value: approvalData.value,
          gas: approvalData.gas,
          data: approvalData.data
        };
        const approveSignedTX = await web3.eth.accounts.signTransaction({ ...approveTxObject, nonce }, privateKey);

        await batch.add(web3.eth.sendSignedTransaction(approveSignedTX.rawTransaction, (err, data) => {
          if (err) {
            console.error('Error executing approve transaction:', err);
          } else {
            console.log('Approval transaction successful:', data);
          }
        }));
      }

      const swapTxData = swapResponse?.data?.data;
      const swapTxObject = {
        chainId: swapTxData.chainId,
        from,
        to: swapTxData.to,
        value: swapTxData.value,
        gas: swapTxData.gas,
        data: swapTxData.data
      };
      const swapSignedTx = await web3.eth.accounts.signTransaction({ ...swapTxObject, nonce: nonce + 1 }, privateKey);

      await batch.add(web3.eth.sendSignedTransaction(swapSignedTx.rawTransaction, (err, data) => {
        if (err) {
          console.error('Error executing swap transaction:', err);
        } else {
          console.log('Swap transaction successful:', data);
        }
      }));
      await batch.execute();
    } catch (error) {
      console.error('Error:', error.response ? error.response.data : error.message);
    }
  }
};
