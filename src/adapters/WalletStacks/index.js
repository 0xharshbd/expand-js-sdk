const { default: axios } = require("axios");
const { bytesToHex } = require("@stacks/common");
const {
  TransactionSigner,
  createStacksPrivateKey,
} = require("@stacks/transactions");
const schemaValidator = require('../../../configuration/schemaValidator');
const common = require('../../../configuration/common');
const config = require('../../../configuration/config.json');


class WalletStacks {
  constructor(options) {
    this.privateKey = options.privateKey,
      this.xApiKey = options.xApiKey
  }

  signTransaction = async (options) => {
    options.function = "stacksSignTransaction()";
    const validJson = await schemaValidator.validateInput(options);

    if (!validJson.valid) {
      return validJson;
    }

    const { chainSymbol, data } = options;
    let { chainId } = options;

    chainId = await common.getChainId({ chainId, chainSymbol });
    const chainName = config.chains[chainId]?.chainName;

    if (chainName !== "Stacks") {
      return {
        "msg": "Stacks wallet can be used only with Stacks chain"
      }
    };

    const signer = new TransactionSigner(data);
    signer.signOrigin(createStacksPrivateKey(this.privateKey));
  
    // Serialize the signed transaction
    const serializedTx = data.serialize();
    const rawTransaction = bytesToHex(serializedTx);

    return { chainId, rawTransaction };
  };

  sendTransaction = async (options) => {
    const filterOptions = options;
    filterOptions.function = "sendTransaction()";
    const validJson = await schemaValidator.validateInput(filterOptions);
    
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
}

module.exports = { WalletStacks }; 