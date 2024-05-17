import { ethers } from 'hardhat';

async function main() {
  const gasOracleAddress = process.env.GAS_ORACLE_ADDRESS;
  if (!gasOracleAddress) {
    throw new Error('No gas oracle address');
  }

  const contract = await ethers.getContractAt('GasOracle', gasOracleAddress);
  const result1 = await contract.chainData(2);
  console.log(result1);

  const result2 = await contract.getTransactionGasCostInNativeToken(2, 1);
  console.log("result: ", result2)


}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
