const { WalletPhantom, prepareTransaction } = require('../src');
const xApiKey = 'TytSO3SsIw98gr6x8ezpI9QFw2LGWVEr8CwUF9Kd';

async function main() {

    const preparedTx = await prepareTransaction('http://localhost:3000/dex/addliquidity', {
        "dexId": "2501",
        "from": "5FxzzbvHSoa9WH4VrMChdp23CcacCpbfpmgKxMFYXJVM",
        "amountIn": ["100000", "1000"],
        "path": [
            "So11111111111111111111111111111111111111112",
            "BRjpCHtyQLNCo8gqRUr8jtdAj5AjPYQaoqbvcZiHok1k"
        ],
            xApiKey
    });
    // const preparedTx = {
    //     "chainId": "901",
    //     "from": "kAtVAPfxVnCGYnYQoQkhPTeRFBgH7ebKfohufiMTGKq",
    //     "value": "100000",
    //     "to": "kAtVAPfxVnCGYnYQoQkhPTeRFBgH7ebKfohufiMTGKq",
    //     "xApiKey": "TytSO3SsIw98gr6x8ezpI9QFw2LGWVEr8CwUF9Kd"
    // }
    console.log(preparedTx);
    const wallet  = new WalletPhantom({ privateKey:'5UrRBtsJghxMe2arxjxtRXiYg5UPxdvttYfV4cLfsDH3FBzXHqEzHqkvqnTVTGLK5MK9jtqdb9w8cytcmKwwsr2b', xApiKey:"TytSO3SsIw98gr6x8ezpI9QFw2LGWVEr8CwUF9Kd"});
    // return;
    const signedTx = await wallet.signTransaction(preparedTx);
    // signedTx.xApiKey = xApiKey;
    // signedTx.chainId = '11155111';
    // let x = Transaction.from(Buffer.from("AQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABAAYNCw8nostWnx4RzOHoYs44d7VHJNPac9fKH1xTPdc2mNAiX8XvGytnueCRqEvFlzBh81CGLjtUweoMbPw7LElWQ0OUv/sWAR1tJhLmGWDU/0tjk2KRHEKGJUstUbt4d6TLXE/ApPn8JKyrMPE2IXdfhSFo+tPdlMRrJYkTijaHsx5kXZzUtgtKyPajl7NBpBSg10bITsIcK3WcQK/X4np4iWnEIwW7m2Hgc6adGRcuNCKb+Ewr1vbwhj7vPYQ1kL3cpb4IWTOJbhi4wglsB+hvXAFLWW8HSCjoDtc7y0BMi/kAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABOHacq/rrTjuXBesOj+EAyyGKfu7+SOoTXSeAMG3jlVjJclj04kifG7PRApFI4NgwtaE5na/xCEBI572Nvp+FkGm4hX/quBhPtof2NGGMA12sQ53BrrO1WYoPAAAAAAAQbd9uHXZaGT2cvhRs7reawctIXtX1s3kTqM9YV+/wCpDgNoX46QkFPkWBIcZvWnau3HcGqhHIL4qpUqjyt4eanQdiU/mCDEuKj8jp+yJiwzU+CbONJPwmMwTMuIKXKZXgMJBgACAAoHCwAHAgACDAIAAACghgEAAAAAAAwLCwABAgYFAwQEBAgq+MaekeF1h8ighgEAAAAAALIIAAAAAAAAUDsBAAEAAAAAAAAAAAAAAAEB","base64"));
    // console.log(x);
    // txBuff = x.serializeMessage();
    // x.addSignature(keypair.publicKey, nacl.sign.detached(txBuff, keypair.secretKey))
    // const serializedTx = x.serialize();
    console.log(signedTx);
    // return;
    // const TxHash = await connection.sendRawTransaction(Buffer.from(signedTx.rawTransaction, "base64"));
    const TxHash =await wallet.sendTransaction(signedTx);
    console.log(TxHash);
    //console.log(https://solscan.io/tx/${TxHash}?cluster=devnet);
}
main();