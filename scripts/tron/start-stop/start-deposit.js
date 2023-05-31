const { callContract } = require('./../helper');

(async function () {

  const poolAddress = process.env.POOL_ADDRESS;
  if (!poolAddress) {
    throw new Error('No bridge address');
  }

  const result = await callContract(
    'Pool',
    poolAddress,
    'startDeposit'
  );
  console.log(result);
})();
