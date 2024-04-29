const solanasdk = require('@solana/web3.js');
const nacl = require('tweetnacl');
const bs58 = require('bs58');
const BN = require('bn.js');

module.exports = {

  signTransactionSolana: async (web3, transactionObject, options) => {
    /*
     * Function will sign the transaction payload for Solana Chain
     */

    try {

      const from = solanasdk.Keypair.fromSecretKey(bs58.decode(options.privateKey));
      let recentBlockhash = await web3.getRecentBlockhash();
      let manualTransaction;
      let transactionBuffer;

      if (!(transactionObject.transactionBuffer)) {
        transactionObject.value = new BN(transactionObject.value);
        manualTransaction = new solanasdk.Transaction({
          recentBlockhash: recentBlockhash.blockhash,
          feePayer: from.publicKey
        });
        manualTransaction.add(solanasdk.SystemProgram.transfer({
          fromPubkey: from.publicKey,
          toPubkey: transactionObject.to,
          lamports: transactionObject.value
        }));
      } else {
        if (transactionObject.from !== from.publicKey.toBase58()) {
          return {
            msg: "signer is not matching with the from address"
          }
        };
        manualTransaction = solanasdk.Transaction.from(Buffer.from(transactionObject.transactionBuffer, "base64"));
      }

      transactionBuffer = manualTransaction.serializeMessage();
      const signature = nacl.sign.detached(transactionBuffer, from.secretKey);
      manualTransaction.addSignature(from.publicKey, signature);
      if (transactionObject.additionalSigners) {
        const additionalKey = solanasdk.Keypair.fromSecretKey(bs58.decode(transactionObject.additionalSigners));
        const signature = nacl.sign.detached(transactionBuffer, additionalKey.secretKey);
        manualTransaction.addSignature(additionalKey.publicKey, signature);
      }
      const serializedTx = manualTransaction.serialize();
      const rawTransaction = Buffer.from(serializedTx).toString("base64");
      return { "rawTransaction": rawTransaction };
    }
    catch (error) {
      return error;
    }
  }
};