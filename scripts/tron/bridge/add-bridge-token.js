const {
  callContract,
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
    'addBridgeToken',
    5,
    ethAddressToBytes32('0xEC087f1dbB58CBCC38f600b99A3753DAa9d3c023'),
    // solanaAddressToBytes32('FpGHqNpwDctcaJyu24M9E2ydTe5owPQgD7UdarKEJHd4'),
  );
  console.log(result);
})();
