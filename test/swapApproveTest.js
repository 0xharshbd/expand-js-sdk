const Web3 = require('web3');
const erc20ABI = require('./WETHERC20.json');
const uniswapRouterABI = require('./UniswapRouterV2.json');
const { batchRequest } = require('../src/batchRequest')
const SEPOLIA_RPC_URL = "https://sepolia.infura.io/v3/fc5d23096e754d64a5f261f5f07170d5"
const WETH_CONTRACT_ADDRESS = "0xfFf9976782d46CC05630D1f6eBAb18b2324d6B14"
const UNISWAP_ROUTER_ADDRESS = "0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D"
const DAI_CONTRACT_ADDRESS = "0x6B175474E89094C44Da98b954EedeAC495271d0F"

// Connect to Ethereum network
const web3 = new Web3(SEPOLIA_RPC_URL);

// Instantiate ERC20 token contract
const tokenContract = new web3.eth.Contract(erc20ABI, WETH_CONTRACT_ADDRESS); // WETH contract address

// Instantiate Uniswap Router contract
const uniswapRouterContract = new web3.eth.Contract(uniswapRouterABI, UNISWAP_ROUTER_ADDRESS);

async function getNonce(account) {
    return await web3.eth.getTransactionCount(account, 'pending');
}

async function getApproveRawTransaction(valueInWei, account, gas, gasPrice) {
    // Approve transaction
    const approveTx = tokenContract.methods.approve(UNISWAP_ROUTER_ADDRESS, valueInWei);
    const approveTxData = approveTx.encodeABI();
    const rawApptoveTx = {
        from: account,
        to: tokenContract.options.address,
        value: '0x0',
        data: approveTxData,
        gas,
        gasPrice: web3.utils.toWei(gasPrice, 'gwei')
    }
    console.log("Raw Swap Transaction --", rawApptoveTx)
    return rawApptoveTx;
}

async function getSwapTransactionData(valueInWei, account, gas, gasPrice) {
    const swapTx = uniswapRouterContract.methods.swapExactTokensForTokens(
        valueInWei,                                       // Amount to swap
        '0',                                              // Minimum amount of output tokens
        [WETH_CONTRACT_ADDRESS, DAI_CONTRACT_ADDRESS],    // Path: WETH -> DAI
        account,                                          // Recipient address
        Date.now() + 1000 * 60 * 10                       // Deadline (10 minutes from now)
    );
    const swapTxData = swapTx.encodeABI();
    const rawSwapTx = {
        from: account,
        to: uniswapRouterContract.options.address,
        value: '0x0',
        data: swapTxData,
        gas,
        gasPrice: web3.utils.toWei(gasPrice, 'gwei')
    };
    console.log("Raw Swap Transaction --", rawSwapTx)
    return rawSwapTx;
}

async function executeBatch(value, account, privateKey, gas, gasPrice, acocunt) {

    // Token amount
    const valueInWei = web3.utils.toWei(value, 'ether');

    const rawApproveTx = await getApproveRawTransaction(valueInWei, account, gas, gasPrice)
    const rawSwapTx = await getSwapTransactionData(valueInWei, account, gas, gasPrice)
    let transactionObjects = [rawApproveTx, rawSwapTx]
    await batchRequest(transactionObjects, privateKey, account)
}

// Account
const account = '0x971A163468df199897cdEf656aAcBFAF32BB395E';
const PRIVATE_KEY = '1afb15236a0f66297994458f1c6d5273ffbf20c816f42fdb44f49a9215051d0b';
const gas = '300000'
const gasPrie = '100'
const value = '0.2'

executeBatch(value, account, PRIVATE_KEY, gas, gasPrie, account);
