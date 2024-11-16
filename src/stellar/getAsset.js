const StellarSdk = require('@stellar/stellar-sdk');
const config = require("../../configuration/config.json");
const schemaValidator = require('../../../configuration/schemaValidator');
// const errorMessage = require('../../configuration/errorMessage.json');



module.exports = {
    getAsset: async (options) => {
        const filterOptions = options;
        filterOptions.function = "sendTransaction()";
        const validJson = await schemaValidator.validateInput(filterOptions);
        
        if (!validJson.valid) {
        return (validJson);
        }
        const {chainId, rawTransaction } = filterOptions;

        const server = new StellarSdk.SorobanRpc.Server(config.chains[chainId].SorobanRpc);
        const { networkPassphrase } = config.chains[chainId];
        try {
        let signedTransaction = TransactionBuilder.fromXDR(rawTransaction, networkPassphrase);
        let sendResponse = await server.sendTransaction(signedTransaction);
        if (sendResponse.status === "PENDING") {
        let getResponse = await server.getTransaction(sendResponse.hash);
        while (getResponse.status === "NOT_FOUND") {
            await new Promise((resolve) => setTimeout(resolve, 1000));
            getResponse = await server.getTransaction(sendResponse.hash);
        }
    
        if (getResponse.status === "SUCCESS") {
            if (!getResponse.resultMetaXdr) {
            throw new Error("Empty resultMetaXDR in getTransaction response");
            }
            let transactionMeta = getResponse.resultMetaXdr;
            let returnValue = transactionMeta.v3().sorobanMeta().returnValue();
            let response = returnValue.value();
            console.log(bufferToString(response[0]._attributes.key._value));
            console.log(bufferToString(response[1]._attributes.key._value));
            console.log(bufferToString(response[2]._attributes.key._value));
            console.log(bufferToString(response[3]._attributes.key._value));
            console.log(bufferToString(response[0]._attributes.val._value));
            console.log(bufferToString(response[1]._attributes.val._value));
            console.log(StellarSdk.StrKey.encodeEd25519PublicKey(response[2]._attributes.val._value._value._value));
            const attributes = response[3]._attributes.val._value._attributes;
            const fullValue = (attributes.hi._value << 64n) + attributes.lo._value;
            console.log(fullValue.toString());
            return returnValue.value();
        } else {
            throw new Error(`Transaction failed: ${getResponse.resultXdr}`);
        }
        } else {
        throw new Error(`Transaction not pending: ${JSON.stringify(sendResponse)}`);
        }
        } catch (err) {
            console.error("Sending transaction failed", err);
            return null;
        }
    }
}