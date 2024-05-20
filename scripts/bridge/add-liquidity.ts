import { ethers } from 'hardhat';
import { handleTransactionResult } from '../helper';

async function main() {
  const poolAddress = process.env.POOL_ADDRESS;
  if (!poolAddress) {
    throw new Error('No bridge address');
  }

  const bridgeAddress = process.env.BRIDGE_ADDRESS;
  if (!bridgeAddress) {
    throw new Error('No bridge address');
  }

  // case 1: AUSD
  // const bridge = await ethers.getContractAt('Bridge', bridgeAddress);

  // const pool = await ethers.getContractAt('Pool', poolAddress);
  // const token = await ethers.getContractAt('Token', await pool.token());
  // await handleTransactionResult(
  //   await token.approve(pool.address, ethers.constants.MaxUint256),
  // );

  // await handleTransactionResult(
  //   await token.approve(bridge.address, ethers.constants.MaxUint256),
  // );

  // await handleTransactionResult(
  //   await pool.deposit('1000' + '0'.repeat(await token.decimals())),
  // );

  // case 2: ALG
  const pool = await ethers.getContractAt('PoolAUSD', poolAddress);

  await handleTransactionResult(
    await pool.deposit('1000' + '0'.repeat(18), { value: '1000' + '0'.repeat(18) }),
  );
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
