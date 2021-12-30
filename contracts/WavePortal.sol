// SPDX-License-Identifier: UNLICENSED

pragma solidity ^0.8.0;

import "hardhat/console.sol";

contract WavePortal {
    uint256 totalWaves;
    uint256 private seed;

    event NewWave(address indexed from, uint256 timestamp, string message);

    struct Wave {
        address waver;
        string message;
        uint256 timestamp;
    }

    Wave[] waves;

    // Store sender's last timestamp to avoid spammers
    mapping(address => uint256) public lastWavedAt;

    constructor() payable {
        seed = (block.timestamp + block.difficulty) % 100;
        console.log("Creating WavePortal v2 with <message,sender,ts> storage");
    }

    function wave(string memory _message) public {
        // Check time difference between messages is bigger than 15mins
        require(
            lastWavedAt[msg.sender] + 15 minutes < block.timestamp,
            "Wait 15mins"
        );
        lastWavedAt[msg.sender] = block.timestamp;

        totalWaves += 1;
        
        waves.push(Wave(msg.sender, _message, block.timestamp));
        emit NewWave(msg.sender, block.timestamp, _message);

        // Give 50% to win prize
        seed = (block.difficulty + block.timestamp + seed) % 100;
        if (seed <= 50) {
            console.log("%s won!", msg.sender);
            
            // Give prize
            uint256 prizeAmount = 0.0001 ether;
            require(
                prizeAmount <= address(this).balance,
                "Trying to withdraw more money than the contract has."
            );

            // Send the sugar
            (bool success, ) = (msg.sender).call{value: prizeAmount}("");

            require(success, "Failed to withdraw money from contract.");
        } else {
            console.log("%s no luck!", msg.sender);
        }
    }

    function getAllWaves() public view returns (Wave[] memory) {
        return waves;
    }

    function getTotalWaves() public view returns (uint256) {
        console.log("We have %d total waves!",  totalWaves);
        return totalWaves;
    }
}
