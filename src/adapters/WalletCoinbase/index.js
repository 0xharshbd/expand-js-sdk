const axios = require('axios').default;
const BN = require('bn.js');
const rawTransaction = require('./signTransaction/index');
const config = require('../../../configuration/config.json');
const common = require('../../../configuration/common');
const schemaValidator = require('../../../configuration/schemaValidator');
const { initialiseWeb3 } = require('../../../configuration/intialiseWeb3');

class WalletCoinbase {

    constructor(options) {
        this.privateKey = options.privateKey;
        this.xApiKey = options.xApiKey;
    };

    signTransaction = async (transactionObject) => {

        const configuration = { "params": {} };
        const transactionOptions = transactionObject;
        transactionOptions.function = "transactionObject()";
        const validObject = await schemaValidator.validateInput(transactionObject);

        if (!validObject.valid) {
            return (validObject);
        }

        axios.defaults.headers['X-API-KEY'] = this.xApiKey;
        const apiURL = `${config.url.apiurl}/chain/getpublicrpc/`;

        const chainId = await common.getChainId({ chainId: transactionObject.chainId, chainSymbol: transactionObject.chainSymbol });

        let chainName = config.chains[chainId].chainName;

        if (chainName !== "Evm")
            return new Error("chain not Supported");

        configuration.params = {
            chainId
        };

        let rpc = await axios.get(apiURL, configuration);
        rpc = rpc.data.data.rpc;
        const web3 = await initialiseWeb3({ rpc: rpc, chainId, key: this.xApiKey });
        transactionOptions.value = new BN(transactionOptions.value);


        const options = {};
        options.privateKey = this.privateKey;
        const rawData = await rawTransaction[`signTransaction${chainName}`](web3, transactionObject, options);
        rawData.chainId = chainId;

        return rawData;
    };

    sendTransaction = async (options) => {

        const filterOptions = options;
        filterOptions.function = "sendTransaction()";
        const validJson = await schemaValidator.validateInput(options);
        if (!validJson.valid) {
            return (validJson);
        }

        try {

            const apiURL = `${config.url.apiurl}/chain/sendtransaction/`;

            const params = {
                method: "post",
                url: apiURL,
                data: options,
                headers: {
                    "x-api-key": this.xApiKey
                }
            };

            const transactionHash = await axios(params);
            return transactionHash.data;
        }

        catch (error) {
            return error;
        }

    };

    signSendBatchTransactions = async (transactionObject) => {
        const transactionOptions = { ...transactionObject, function: "batchTransactions()" };
        const validObject = await schemaValidator.validateInput(transactionOptions);

        if (!validObject.valid) return (validObject);

        axios.defaults.headers['X-API-KEY'] = this.xApiKey;
        const apiURL = `${config.url.apiurl}chain/getpublicrpc/`;

        const chainId = await common.getChainId({
            chainId: transactionObject.chainId,
            chainSymbol: transactionObject.chainSymbol
        });

        let rpc = await axios.get(apiURL, { params: { chainId } }).then(res => res?.data?.data?.rpc || "");
        const web3 = await initialiseWeb3({ rpc, chainId, key: this.xApiKey });

        let chainName = config.chains[chainId].chainName;
        const transaction = await rawTransaction[`signSendBatchTransactions${chainName}`](web3, transactionObject, {
            privateKey: this.privateKey
        });
        transaction.chainId = chainId;
        return transaction;
    }

}

module.exports = { WalletCoinbase };

