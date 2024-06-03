const { Wallet, prepareTransaction } = require("../src");

async function swap() {
  const xApiKey = "tK503cR23o8YTvXhNoDNo7kQf5sQdbXP8qbqkBeQ"
  const privateKey = "c03e8ee249d32de6a5e15cf526f05c89d574c275890be6ddbc61128facde79da"

  const wallet = new Wallet({ privateKey, xApiKey });
  
  // Preparing transaction
  const preparedTx = await prepareTransaction('https://api.expand.network/dex/swap', {
    "dexId": "1300",
    "path": [
        "0x7d1afa7b718fb893db30a3abc0cfc608aacfebb0",
        "0xdac17f958d2ee523a2206206994597c13d831ec7"
    ],
    "amountIn": "50000000000000000000", // 50 Matic
    "amountOutMin": "730655",
    "to": "0x7fbc79aa073349bc6bb69c080437d78815e75804",
    "gas": "80000",
    "from": "0x7fbc79aa073349bc6bb69c080437d78815e75804",
    "deadline": "1716461989",
    "slippage": "1",
    xApiKey
});

  console.log(preparedTx);
  // Signing transaction
  
  const signedTx = await wallet.signTransaction(preparedTx); 

  // //Sending transaction
  // const tx = await wallet.sendTransaction(signedTx);
  // console.log("Transaction Pending....", tx.data);
}
swap();