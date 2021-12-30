// Execute file with:
// > npx hardhat run scripts/run.js
// Hardhat will import the Hardhat Runtime Environment (hre)

const main = async () => {
    // Compile and generate artifact files
    const waveContractFactory = await hre.ethers.getContractFactory('WavePortal'); 
    
    // Hardhat creates a fresh/clean local network (blockchain) only for this contract
    const waveContract = await waveContractFactory.deploy({
        value: hre.ethers.utils.parseEther("0.1"),
    });
    
    // Wait for contract to be deployed in the network, contructors are called during this process
    await waveContract.deployed();

    // Get contract balance
    let contractBalance = await hre.ethers.provider.getBalance(waveContract.address);
    console.log("Contract balance: ", hre.ethers.utils.formatEther(contractBalance));

    const [owner, randomPerson] = await hre.ethers.getSigners();
    // Get address of deployed contract
    console.log("Contract deployed to : ", waveContract.address);
    console.log("By: ", owner.address);
    
    // Get initial state
    let waveCount = await waveContract.getTotalWaves(); // Contract calls the log functions
    let allWaves = await waveContract.getAllWaves();
    console.log("AllWaves \n", allWaves);

    // Send some waves
    let waveTxn = await waveContract.wave("First message :)!");
    await waveTxn.wait();

    waveTxn = await waveContract.connect(randomPerson).wave("Random person wave!");
    await waveTxn.wait();
    
    // Get new state
    waveCount = await waveContract.getTotalWaves();
    allWaves = await waveContract.getAllWaves();
    console.log("AllWaves \n", allWaves);

    // Read new balance
    contractBalance = await hre.ethers.provider.getBalance(waveContract.address);
    console.log("Contract balance: ", hre.ethers.utils.formatEther(contractBalance));
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
