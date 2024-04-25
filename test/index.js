const sdk = require('../src/approveAndSwap')

let options = {
  "dexId": "1000",
  "amountIn": "10",
  "amountOutMin": "0",
  "path": ["0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2", "0x6B175474E89094C44Da98b954EedeAC495271d0F"],
  "to": "0x971A163468df199897cdEf656aAcBFAF32BB395E",
  "poolFees": "3000",
  "from": "0x971A163468df199897cdEf656aAcBFAF32BB395E",
  "gas": "173376",
  "privateKey": "",
  "xApiKey": "cGMICzorjYpviahj2vtU5T3f8y1ivf81rdRByI70",
  "deadline": "1713894176",
  "chainId": "1"
}

sdk.approveAndSwap(options)