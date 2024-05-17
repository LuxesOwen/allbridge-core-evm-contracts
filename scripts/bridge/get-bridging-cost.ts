import { ethers } from 'hardhat';
import { addressToBytes32, getEnv, handleTransactionResult } from '../helper';

async function main() {
  const bridgeAddress = getEnv('BRIDGE_ADDRESS');
  const bridge = await ethers.getContractAt('Bridge', bridgeAddress);
  const tokenAddress = getEnv('TOKEN_ADDRESS');
  // const token = await ethers.getContractAt('Token', tokenAddress);

  // const destinationChainId = 4;
  // const messengerProtocol = 1;

  const addressZero = "0x0000000000000000000000000000000000000000"
  const swapedValue = await bridge.getSwapValue(
    1000000,
    addressToBytes32(tokenAddress),
    addressToBytes32(addressZero)
  );
  console.log("swapped value: ", swapedValue)

  const result = await bridge.swap(
    1000000,
    addressToBytes32(tokenAddress),
    addressToBytes32(addressZero),
    "0x69281A1749248e1a937eEF6EDe61Ca48c38c128C",
    0
  )
  await handleTransactionResult(result);

  // const bridgingCost = await bridge.getBridgingCostInTokens(
  //   destinationChainId,
  //   messengerProtocol,
  //   tokenAddress
  // );
  // const decimals = await token.decimals();
  // const symbol = await token.symbol();
  // const bridgingCostInUsd = Big(bridgingCost.toString()).div(Big(10).pow(decimals));
  // console.log(`bridgingCost = ${bridgingCostInUsd} ${symbol}`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
