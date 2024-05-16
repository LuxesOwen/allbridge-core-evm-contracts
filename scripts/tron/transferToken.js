const { callContract } = require('./helper');

(async function () {
  const tokenAddress = process.env.TOKEN_ADDRESS;
//   const spenderAddress = process.env.POOL_ADDRESS;
  const result = await callContract(
    'Token',
    tokenAddress,
    'transfer',
    'TCFs8p6ayBzZWdsXWJ4VFAov53cvj6va8Q',
    '100000' + '0'.repeat(18),
  );
  console.log(result);
})();
