// SPDX-License-Identifier: MIT
pragma solidity ^0.8.27;

import "forge-std/Script.sol";
import "../src/LendingBorrowingSystem.sol";

contract Deploy is Script {
    function run() external {
        uint256 deployerPrivateKey = vm.envUint("PRIVATE_KEY");
        vm.startBroadcast(deployerPrivateKey);

        LendingBorrowingSystem system = new LendingBorrowingSystem();

        vm.stopBroadcast();

        console.log("LendingBorrowingSystem deployed at:", address(system));
        console.log(
            "Collateral Token (cETH) deployed at:",
            address(system.cETH())
        );
        console.log(
            "Liability Token (lETH) deployed at:",
            address(system.lETH())
        );
    }
}
