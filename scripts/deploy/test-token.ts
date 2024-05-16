import { ethers } from 'hardhat';
import { handleDeployResult } from '../helper';

async function main() {
  const Contract = await ethers.getContractFactory('Token');
  // const contract = await Contract.deploy(
  //   'USDY',
  //   'USDY',
  //   '1000000000000' + '0'.repeat(6),
  //   6,
  // );

  const contract = await Contract.deploy(
    'USDC',
    'USDC',
    '10000000000' + '0'.repeat(6),
    6,
  );
  await handleDeployResult(contract);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
