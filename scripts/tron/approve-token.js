const { callContract } = require('./helper');

(async function () {
  const tokenAddress = process.env.TOKEN_ADDRESS;
  const spenderAddress = process.env.POOL_ADDRESS;
  const bridgeAddress = process.env.BRIDGE_ADDRESS;
  const result1 = await callContract(
    'Token',
    tokenAddress,
    'approve',
    spenderAddress,
    '1000000000000' + '0'.repeat(18),
  );
  console.log(result1);

  const result2 = await callContract(
    'Token', 
    tokenAddress,
    'approve',
    bridgeAddress,
    '1000000000000' + '0'.repeat(18),
  )
  console.log("result2: ", result2)
})();
