require("dotenv").config();
const axios = require("axios");
const web3 = require("web3");
const { batchRequest } = require('../src/batchRequest');
const config = require('../configuration/config.json');


const expand_url = config.url.apiurl;
const headers = { 'x-api-key': process.env.xApiKey };
const privateKey  = process.env.WALLET_PRIVATE_KEY;


async function getApproveTx(options) {
    const rawApprovedTx = await axios.post(expand_url + 'fungibletoken/approve', options, { headers });
    return rawApprovedTx.data.data;
 }

async function getSwapTransaction(options) {
   const rawSwapTx = await axios.post(expand_url + 'dex/swap', options, { headers });
   return rawSwapTx.data.data;
};


async function getFeeTx(swapTx) {
   const feeTx = await axios.post(expand_url + 'chain/createfeetransaction', swapTx, { headers });
   return feeTx.data.data;
}

async function executeBatch(transactionObjects, privateKey, account) {
    await batchRequest(transactionObjects, privateKey, account)
}


async function main() {


    const approveParams = {
        "from": "<EOA_ADDRESS>", // Your EOA Address
        "tokenAddress":"0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2",  
        "amount": "1000000000000000000000",                  
        "to": "0x68b3465833fb72a70ecdf485e0e4c7bd8665fc45", // Uni V3 - Spender Address
        "gas": "100000",
        "chainId": "1"
    };
  
    const swapParams = {
           "dexId":"1300",
           "amountIn": "1000000000000000",
           "amountOutMin": "0",
           "path": [
                        "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2",
                        "0x6B175474E89094C44Da98b954EedeAC495271d0F"
                   ],                   // From_Token, To_Token
           "to": "<EOA_ADDRESS>",       // Your EOA Address
           "deadline": "1965990894",
           "from": "<EOA_ADDRESS>",     // Your EOA Address
           "gas": "203376",
           "involveBaseToken": "1"
   };


   // Prepare the Approved transaction
   const approvedTx = await getApproveTx(approveParams);
   console.log("approvedTx --", approvedTx);

   // Prepare the swap transaction
   const swapTx = await getSwapTransaction(swapParams);
   console.log("swapTx --", swapTx);
  
   const feeTx = await getFeeTx(swapTx);
   console.log("feeTx --", feeTx);


   const executeBatchCall = await executeBatch([approvedTx, swapTx, feeTx], privateKey, approveParams.from);
    console.log("executeBatch --", executeBatchCall);

};


main();
