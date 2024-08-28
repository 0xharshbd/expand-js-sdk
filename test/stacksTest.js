const { WalletStacks } = require('../src/index');
const dotenv = require('dotenv');
const {
  AnchorMode,
  makeUnsignedSTXTokenTransfer,
  createStacksPrivateKey,
  getPublicKey,
  publicKeyToString,
} = require("@stacks/transactions");


const main = async () => {
  dotenv.config();

  const privateKey = process.env.xrplSecretKey;
  const recipient = "<wallet address>"; 

  // Initialise the wallet client
  const wallet = new WalletStacks({ xApiKey: process.env.xApiKey, privateKey });

  const privateKeyBuffer = createStacksPrivateKey(privateKey);
  const publicKeyBuffer = getPublicKey(privateKeyBuffer);
  const publicKey = publicKeyToString(publicKeyBuffer);

  // Transfer token function from Stacks SDK
  const transaction = await makeUnsignedSTXTokenTransfer({
    network: "testnet",
    recipient,
    amount: "100",
    fee: "300",
    memo: "Expand",
    publicKey: publicKey,
    anchorMode: AnchorMode.Any,
  });

  const preparedTx = {
    chainId: "1701",
    data: transaction
  }

  // Securely sign the transaction on user's end
  const signedTx = await wallet.signTransaction(preparedTx);
  const tx = await wallet.sendTransaction(signedTx);

  console.log("Tx: ", tx);
}

main();

