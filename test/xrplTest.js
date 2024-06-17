const { WalletXRPL, prepareTransaction } = require('../src/index');
const dotenv = require('dotenv');

const main = async () => {
  dotenv.config();

  const wallet1 = "<user address>";
  const wallet2 = "<user address>"; 

  // Initialise the wallet client
  const wallet = new WalletXRPL({ xApiKey: process.env.xApiKey, privateKey: process.env.xrplSecretKey });

  // Prepare the transaction from expand api
  const preparedTx = await prepareTransaction('http://localhost:3000/rwa/freeze', {
    "chainId": "1601",
    "user": wallet1,
    "amount": "<amount>",
    "assetCode": "<assetCode>",
    "issuer": wallet2,
    "xApiKey": process.env.xApiKey
  });

  console.log(preparedTx?.response?.data);

  // Securely sign the transaction on user's end
  const signedTx = await wallet.signTransaction(preparedTx);
  const tx = await wallet.sendTransaction(signedTx);

  console.log("Tx: ", tx);
}

main();

