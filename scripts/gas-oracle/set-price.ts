import { ethers } from 'hardhat';
import { handleTransactionResult } from '../helper';

async function main() {
    const gasOracleAddress = process.env.GAS_ORACLE_ADDRESS;
    if (!gasOracleAddress) {
        throw new Error('No gas oracle address');
    }

    const contract = await ethers.getContractAt('GasOracle', gasOracleAddress);
    // setChainData(uint chainId_, uint128 price_, uint128 gasPrice)
    const result = await contract.setChainData(2, 3000, 0.000000001);
    await handleTransactionResult(result);
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});
