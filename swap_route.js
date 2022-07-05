import { AlphaRouter } from '@uniswap/smart-order-router'
import { Token, CurrencyAmount } from '@uniswap/sdk-core'

const V3_SWAP_ROUTER_ADDRESS = '0x68b3465833fb72A70ecDF485E0e4C7bD8665Fc45';
const MY_ADDRESS = '0xBcE195d127cE562D435d624fF9338a999eAE2a49';
const web3Provider = 'https://mainnet.infura.io/v3/681332a2c23a4ce8ac972bfbdfa75555'

const router = new AlphaRouter({ chainId: 1, provider: web3Provider });

const WETH = new Token(
  1,
  '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2',
  18,
  'WETH',
  'Wrapped Ether'
);

const USDC = new Token(
  1,
  '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48',
  6,
  'USDC',
  'USD//C'
);

const typedValueParsed = '100000000000000000000'
const wethAmount = CurrencyAmount.fromRawAmount(currency, JSBI.BigInt(typedValueParsed));

const route = await router.route(
  wethAmount,
  USDC,
  TradeType.EXACT_INPUT,
  {
    recipient: myAddress,
    slippageTolerance: new Percent(5, 100),
    deadline: Math.floor(Date.now()/1000 +1800)
  }
);

console.log(`Quote Exact In: ${route.quote.toFixed(2)}`);
console.log(`Gas Adjusted Quote In: ${route.quoteGasAdjusted.toFixed(2)}`);
console.log(`Gas Used USD: ${route.estimatedGasUsedUSD.toFixed(6)}`);

const transaction = {
  data: route.methodParameters.calldata,
  to: V3_SWAP_ROUTER_ADDRESS,
  value: BigNumber.from(route.methodParameters.value),
  from: MY_ADDRESS,
  gasPrice: BigNumber.from(route.gasPriceWei),
};

await web3Provider.sendTransaction(transaction);