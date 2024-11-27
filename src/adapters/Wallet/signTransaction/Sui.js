const { TransactionBlock, RawSigner } = require('@mysten/sui.js');
const { Ed25519Keypair } = require('@mysten/sui/keypairs/ed25519');
const { Transaction } = require('@mysten/sui/transactions');
const { fromBase64 } = require('@mysten/sui/utils');
const config = require('../../../../configuration/config.json');

module.exports = {

    signTransactionSui: async (web3, transactionObject, options) => {

        try {
            // get the secretkey from options
            const secretKey = options.privateKey;
            const keyPair = Ed25519Keypair.fromSecretKey(secretKey);
            const txAsUint8Array = fromBase64(transactionObject.data);
            let txAsJson = new TextDecoder().decode(txAsUint8Array);
            const transactionBlock = Transaction.from(txAsJson);
            console.log(transactionBlock);
            // Sign the transaction Block
            const {bytes, signature} = await transactionBlock.sign({
                client: web3,
                signer: keyPair,
              });
            return { "rawTransaction": bytes,
                     "signature": signature
             };

        } catch (error) {
            return (error);

        }
    }
};