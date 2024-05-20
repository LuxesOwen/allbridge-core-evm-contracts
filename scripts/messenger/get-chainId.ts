import { ethers } from 'hardhat';

async function main() {
    const messengerAddress = process.env.MESSENGER_ADDRESS;
    if (!messengerAddress) {
        throw new Error('No gas oracle address');
    }

    const contract = await ethers.getContractAt('Messenger', messengerAddress);
    const result = await contract.chainId();
    console.log(result);
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});
