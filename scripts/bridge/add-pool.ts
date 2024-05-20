import { ethers } from 'hardhat';
import { addressToBytes32, handleTransactionResult } from '../helper';

async function main() {
  const bridgeAddress = process.env.BRIDGE_ADDRESS;
  if (!bridgeAddress) {
    throw new Error('No bridge address');
  }

  const poolAddress = process.env.POOL_ADDRESS;
  if (!poolAddress) {
    throw new Error('No bridge address');
  }

  const tokenAddress = "0x0000000000000000000000000000000000000000";
  // const tokenAddress = process.env.TOKEN_ADDRESS;
  if (!tokenAddress) {
    throw new Error('No token address');
  }
  console.log("tokenAddress: ", addressToBytes32(tokenAddress))

  const contract = await ethers.getContractAt('Bridge', bridgeAddress);
  const result = await contract.addPool(
    poolAddress,
    addressToBytes32(tokenAddress)
  );
  await handleTransactionResult(result);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
