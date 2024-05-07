const sdk = require('../src/approveAndSwap')

let options = {
  "dexId": "1000",
  "amountIn": "1000000000000000",
  "amountOutMin": "0",
  "path": ["0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2", "0x6B175474E89094C44Da98b954EedeAC495271d0F"],
  "to": "0xb7fe270A97cbC0157f415fb1a25EdaCeb65c0AE7",
  // "poolFees": "3000",
  "from": "0xb7fe270A97cbC0157f415fb1a25EdaCeb65c0AE7",
  "gas": "200400",
  "privateKey": "61af74f078718a15950094c90dfff0428ba380b42413c4c1c40bf108fcd9abcf",
  "xApiKey": "q9kfozyMWG80FzIbJVyh07L38mypZdDH8fCeE3Mx",
  "deadline": "1715150672",
  "chainId": "1",
  "involveBaseToken":"1"
}

sdk.approveAndSwap(options)