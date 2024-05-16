import { ethers } from 'hardhat';
import {
  handleTransactionResult,
  addressToBytes32,
  solanaAddressToBytes32,
  tronAddressToBytes32
} from '../helper';

async function main() {
  const bridgeAddress = process.env.BRIDGE_ADDRESS;
  if (!bridgeAddress) {
    throw new Error('No bridge address');
  }

  const contract = await ethers.getContractAt('Bridge', bridgeAddress);
  /* cSpell:disable */
  const result = await contract.addBridgeToken(
    2,
    // tronAddressToBytes32('TEJj4ToPSJ1T24JyrMAeofMF4vBUjHE8zs'),
    addressToBytes32('0xEd1F80d52f863b8e37BdF8aA01aCa5736DA9A194'),
    // solanaAddressToBytes32('FpGHqNpwDctcaJyu24M9E2ydTe5owPQgD7UdarKEJHd4'), // mint address
  );
  /* cSpell:enable */
  await handleTransactionResult(result);

  // remove bridge token for algen
  // const result2 = await contract.removeBridgeToken(
  //   4,
  //   tronAddressToBytes32('TEJj4ToPSJ1T24JyrMAeofMF4vBUjHE8zs'),
  //   // addressToBytes32('0xfc4048f6c558a5CC88D31C90B155817B84073CA7'),
  //   // solanaAddressToBytes32('FpGHqNpwDctcaJyu24M9E2ydTe5owPQgD7UdarKEJHd4'), // mint address
  // );
  // await handleTransactionResult(result2);

}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
