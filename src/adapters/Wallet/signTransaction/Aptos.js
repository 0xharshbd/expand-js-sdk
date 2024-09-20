const { TxnBuilderTypes, BCS, AptosAccount, 
        AptosClient, HexString } = require('aptos');
const config = require('../../../../configuration/config.json');

module.exports = {

    signTransactionAptos: async (web3, transactionObject, options) => {
        /*
         * Function will sign the transaction payload for Aptos chain
         */

        try {
            const { privateKey } = options;
            const chainId = (options.chainId && options.chainId === "1400") ? "1" : "2";

            const accountFrom = new AptosAccount(HexString.ensure(privateKey).toUint8Array());

            let { data } = transactionObject;

            let transactionBuffer;

            if (!data){
                const seq = await web3.getAccount(accountFrom.address());
                transactionBuffer = new TxnBuilderTypes.RawTransaction(
                    TxnBuilderTypes.AccountAddress.fromHex(transactionObject.from),
                    BigInt(seq.sequence_number),
                    new TxnBuilderTypes.TransactionPayloadEntryFunction(
                        TxnBuilderTypes.EntryFunction.natural(
                            '0x1::coin',
                            "transfer",
                            [new TxnBuilderTypes.TypeTagStruct(TxnBuilderTypes.StructTag.fromString(config.chains[options.chainId].aptosCoin))],
                            [BCS.bcsToBytes(TxnBuilderTypes.AccountAddress.fromHex(transactionObject.to)), BCS.bcsSerializeUint64(transactionObject.value)]
                        ),
                    ),
                    options.gas ? options.gas : 1000,
                    100,
                    BigInt(Math.floor(Date.now() / 1000) + 10000),
                    new TxnBuilderTypes.ChainId(chainId),
                );
            } else {
                const decodedBytes = Buffer.from(data, "base64");
                const deserializer = new BCS.Deserializer(new Uint8Array(Buffer.from(decodedBytes, "base64")));
                transactionBuffer = TxnBuilderTypes.RawTransaction.deserialize(deserializer);
            }

            const bcsTxn = AptosClient.generateBCSTransaction(accountFrom, transactionBuffer);

            const rawTransaction = Buffer.from(bcsTxn).toString("base64");

            return { "rawTransaction": rawTransaction };

        }
        catch (error) {
            return error;
        }
    }
};