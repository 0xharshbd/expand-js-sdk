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
  const wallet = new WalletStellar({ xApiKey: "5w2mbkrVsk2R0OkHM6xy24uazkI7wAe82f1dbzC5", privateKey: "SA66XQI6UIYDYXP4ZCAE6V4U67MKYHTDRNRTO4LQTNR5HFCD245KCDZD"
    // process.env.privateKey 
                                                                                    });

  // Prepare the transaction from expand api
//   const preparedTx = await prepareTransaction('http://localhost:3000/rwa/issue', {
//     "chainId": "1501",
//     "issuer": "<Issuer>",
//     "assetCode": "<ExpandDollar>",
//     "amount": "50",
//     "to": "<Distributor>",
//     "xApiKey": process.env.xApiKey
//   });
const preparedTx =  {
  "chainId": "1501",
  "from": "GBHNAGV2LOLROYI3R4T7G6YVZ4WXHLVO62C4N5PNIPNUTPOCD4LQ3B4X",
  "gas": "100",
  "data": "AAAAAgAAAABO0Bq6W5cXYRuPJ/N7Fc8tc66u9oXG9e1D20m9wh8XDQABi3oACi7CAAAAbgAAAAEAAAAAAAAAAAAAAABnOxxeAAAAAAAAAAEAAAAAAAAAGAAAAAAAAAABdQkx/kzgJnVhz0AiD4l/mgcFCk/VPt4Bf66rdSb9wvYAAAATZ2V0X2Fzc2V0c19ieV9vd25lcgAAAAABAAAAEgAAAAAAAAAATtAauluXF2EbjyfzexXPLXOurvaFxvXtQ9tJvcIfFw0AAAAAAAAAAQAAAAAAAAADAAAABgAAAAF1CTH+TOAmdWHPQCIPiX+aBwUKT9U+3gF/rqt1Jv3C9gAAAA8AAAAHUldBX01BUAAAAAABAAAABgAAAAF1CTH+TOAmdWHPQCIPiX+aBwUKT9U+3gF/rqt1Jv3C9gAAABQAAAABAAAAB7+gqrYvvrjZidzaCxOaoUH99/fWr8S6OE06cUGJJKDmAAAAAAAd5/EAACIMAAAAAAAAAAAAAYsWAAAAAA=="
}


  // Securely sign the transaction on user's end
  const signedTx = await wallet.signTransaction(preparedTx);
  // console.log("Signed Tx: ", signedTx);
  const tx = await wallet.sendTransaction(signedTx);
  // const response =await getAsset(tx.data);
  // const response =await getAllAssets(tx.data);
  // const response =await getOwnerAssets(tx.data);
  console.log(response);
}

main();