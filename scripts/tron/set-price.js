const {
  callContract
} = require('./helper');

(async function () {
  const bridgeAddress = process.env.GAS_ORACLE_ADDRESS;
  if (!bridgeAddress) {
    throw new Error('No bridge address');
  }

  const result = await callContract(
    'GasOracle',
    bridgeAddress,
    'setChainData',
    4,
    3000, 
    1
  );
  console.log(result);
})();
