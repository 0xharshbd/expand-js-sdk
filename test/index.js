const config = require('../configuration/config.json')
const Web3 = require('web3');
const erc20ABI = require('../assets/abis/WETHERC20.json');
const uniswapRouterABI = require('../assets/abis/UniswapRouterV2.json');

const SEPOLIA_RPC_URL = config?.rpc_url?.sepolia
const WETH_CONTRACT_ADDRESS = config?.contract_address?.WETH
const UNISWAP_ROUTER_ADDRESS = config?.contract_address?.UNISWAPV2
const DAI_CONTRACT_ADDRESS = config?.contract_address?.DAI
const {batchRequest} = require('../src/batchRequest')
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

async function executeBatch(value, account, privateKey, gas, gasPrice,) {

  // Token amount
  const valueInWei = web3.utils.toWei(value, 'ether');

  const rawApproveTx = await getApproveRawTransaction(valueInWei, account, gas, gasPrice)
  const rawSwapTx = await getSwapTransactionData(valueInWei, account, gas, gasPrice)

  batchRequest([rawApproveTx, rawSwapTx], PRIVATE_KEY, account)
}

// Account
const account = '0x971A163468df199897cdEf656aAcBFAF32BB395E';
const PRIVATE_KEY = '1afb15236a0f66297994458f1c6d5273ffbf20c816f42fdb44f49a9215051d0b';
const gas = '300000'
const gasPrie = '100'
const value = '0.0000002'

executeBatch(value, account, PRIVATE_KEY, gas, gasPrie);
