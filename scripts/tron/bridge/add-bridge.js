const {
  callContract,
  tronAddressToBuffer32,
  ethAddressToBytes32,
  solanaAddressToBytes32,
} = require('../helper');

(async function () {
  const bridgeAddress = process.env.BRIDGE_ADDRESS;
  if (!bridgeAddress) {
    throw new Error('No bridge address');
  }

  const result = await callContract(
    'Bridge',
    bridgeAddress,
    'registerBridge',
    5,
    ethAddressToBytes32('0x24D51a10a64a5501adC67f79681E56e048dA3DAA'),
    // solanaAddressToBytes32('ERrse1kNoZPcY2BjRXQ5rHTCPDPwL1m2NQ2sGSj6cW7C'), // authority address
  );
  console.log(result);
})();
