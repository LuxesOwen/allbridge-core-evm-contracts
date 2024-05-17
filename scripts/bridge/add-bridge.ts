import { parseUnits } from 'ethers/lib/utils';
import { ethers } from 'hardhat';
import {
  handleTransactionResult,
  solanaAddressToBytes32,
  addressToBytes32,
  tronAddressToBytes32
} from '../helper';

async function main() {
  const bridgeAddress = process.env.BRIDGE_ADDRESS;
  if (!bridgeAddress) {
    throw new Error('No bridge address');
  }

  const contract = await ethers.getContractAt('Bridge', bridgeAddress);
  /* cSpell:disable */
  // const result = await contract.registerBridge(
  //   2,
  //   // tronAddressToBytes32('TDYdSH11JysLerX4Fdmi143qo65oNafVCB'),
  //   addressToBytes32('0x94a8295d1044232551d5CBA59c811272ad625f7C'),
  //   // solanaAddressToBytes32('ERrse1kNoZPcY2BjRXQ5rHTCPDPwL1m2NQ2sGSj6cW7C'), // authority address
  // );
  // /* cSpell:enable */
  // await handleTransactionResult(result);

  // call swap
  const tokenAddress = process.env.TOKEN_ADDRESS as string;
  const recipient = addressToBytes32("0x69281A1749248e1a937eEF6EDe61Ca48c38c128C");
  const destinationChainId = 2;
  const nonce = 1;
  const messenger = 1;
  const amount = 100000000;

  const response = await contract.swapAndBridge(
    addressToBytes32(tokenAddress),
    amount,
    recipient,
    destinationChainId,
    addressToBytes32("0xEd1F80d52f863b8e37BdF8aA01aCa5736DA9A194"),
    nonce,
    messenger,
    0,
    { value: 10000 }
  );
  await handleTransactionResult(response);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
