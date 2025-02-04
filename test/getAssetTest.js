const { Keypair, TransactionBuilder, Networks } = require('stellar-sdk');
const { WalletStellar, prepareTransaction } = require('../src/index');

const {getAsset} = require('../src/stellar/getAsset');
const {getAllAssets} = require('../src/stellar/getAllAssets');
const { getOwnerAssets } = require('../src/stellar/getOwnerAssets');
const dotenv = require('dotenv');

const main = async () => {
  // configure the env
  dotenv.config();

  // Initialise the wallet client
  const wallet = new WalletStellar({ xApiKey: process.env.xApiKey, privateKey: process.env.privateKey });

  // Prepare the transaction from expand api
  const preparedTx = await prepareTransaction('http://localhost:3000/rwa/issue', {
    "chainId": "1501",
    "issuer": "<Issuer>",
    "assetCode": "<ExpandDollar>",
    "amount": "50",
    "to": "<Distributor>",
    "xApiKey": process.env.xApiKey
  });


  // Securely sign the transaction on user's end
  const signedTx = await wallet.signTransaction(preparedTx);
  // console.log("Signed Tx: ", signedTx);
  const tx = await wallet.sendTransaction(signedTx);
  // const response =await getAsset(tx.data);
  // const response =await getAllAssets(tx.data);
  // const response =await getOwnerAssets(tx.data);
  console.log("tx",tx);
  console.log(response);
}

main();