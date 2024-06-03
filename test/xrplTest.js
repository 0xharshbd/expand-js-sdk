const { WalletXRPL, prepareTransaction } = require('../src/index');
const dotenv = require('dotenv');

const main = async () => {
  // configure the env
  dotenv.config();

  const wallet1 = "rHj2VSZ6hVcg4gNXQ1sUDV8svgyZU3m2j";
  const wallet2 = "rw1QiNoXk3rv7MU3eXxbu41kovA9eP27R1";
  const wallet1Secret = "dynamic remember coffee churn rigid estate rubber breeze favorite slam essence mouse";
  const wallet2Secret = "battle fragile short disease close inspire north exclude decide spice original idle";

  // Initialise the wallet client
  const wallet = new WalletXRPL({ xApiKey: "Mqjy4Wf5mZ7NlixNDAqaE2CxjNqEgdD34pueYJvc", privateKey: "sEd725KzSzAvipRjpKwxXmjBebX3Rhy" });

  // Prepare the transaction from expand api
  const preparedTx = await prepareTransaction('http://localhost:3000/rwa/transfer', {
    "chainId": "1601",
    "from": "rUHB1EFDRWHonEfGU7hFuYKyBGuEgsFu7x",
    "amount": "18000000",
    "to": wallet1,
    "xApiKey": "Mqjy4Wf5mZ7NlixNDAqaE2CxjNqEgdD34pueYJvc"
  });

  console.log(preparedTx);
  // Securely sign the transaction on user's end
  const signedTx = await wallet.signTransaction(preparedTx);
  console.log(signedTx)
  const tx = await wallet.sendTransaction(signedTx);

  console.log("Tx: ", tx);
}

main();

