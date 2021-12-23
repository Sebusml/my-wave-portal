const main = async () => {
    // Compile and generate artifact files
    const waveContractFactory = await hre.ethers.getContractFactory('WavePortal'); 
    
    // Hardhat creates a fresh/clean local network (blockchain) only for this contract
    const waveContract = await waveContractFactory.deploy();
    
    // Wait for contract to be deployed in the network, contructors are called during this process
    await waveContract.deployed();

    // Get address of deployed contract
    console.log("Contract deployed to : ", waveContract.address);
}

const runMain = async () => {
    try {
        await main();
        process.exit(0);
    } catch (error) {
        console.log(error);
        process.exit(1);
    }
};

runMain();
