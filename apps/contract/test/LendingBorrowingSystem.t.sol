// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "forge-std/Test.sol";
import "../src/LendingBorrowingSystem.sol";

contract LendingBorrowingSystemTest is Test {
    LendingBorrowingSystem public system;
    address public alice = address(0x1);
    address public bob = address(0x2);

    function setUp() public {
        system = new LendingBorrowingSystem();
        vm.deal(alice, 100 ether);
        vm.deal(bob, 100 ether);
    }

    function testFuzz_Lend(uint256 amount) public {
        vm.assume(amount > 0 && amount <= 100 ether);
        vm.prank(alice);
        system.lend{value: amount}();
        assertEq(system.cETH().balanceOf(alice), amount);
    }

    function testFuzz_Borrow(uint256 amount) public {
        vm.assume(amount > 0 && amount <= system.BORROW_LIMIT());

        // First, lend some ETH to the system
        vm.prank(alice);
        system.lend{value: 1 ether}();

        uint256 initialBalance = bob.balance;
        vm.prank(bob);
        system.borrow(amount);

        assertEq(system.lETH().balanceOf(bob), amount);
        assertEq(bob.balance, initialBalance + amount);
    }

    function testFuzz_RedeemCollateral(uint256 amount) public {
        vm.assume(amount > 0 && amount <= 1 ether);

        // First, lend some ETH to the system
        vm.prank(alice);
        system.lend{value: 1 ether}();

        uint256 initialBalance = alice.balance;
        vm.prank(alice);
        system.redeem(amount, true);

        assertEq(system.cETH().balanceOf(alice), 1 ether - amount);
        assertEq(alice.balance, initialBalance + amount);
    }

    function testFuzz_RedeemLiability(uint256 amount) public {
        vm.assume(amount > 0 && amount <= system.BORROW_LIMIT());

        // First, lend some ETH to the system
        vm.prank(alice);
        system.lend{value: 1 ether}();

        // Then borrow some ETH
        vm.prank(bob);
        system.borrow(amount);

        uint256 initialBalance = bob.balance;
        vm.prank(bob);
        system.redeem(amount, false);

        assertEq(system.lETH().balanceOf(bob), 0);
        assertEq(bob.balance, initialBalance - amount);
    }

    function testFuzz_LendBorrowRedeem(
        uint256 lendAmount,
        uint256 borrowAmount
    ) public {
        vm.assume(lendAmount > 0 && lendAmount <= 100 ether);
        vm.assume(borrowAmount > 0 && borrowAmount <= system.BORROW_LIMIT());

        // Lend
        vm.prank(alice);
        system.lend{value: lendAmount}();
        assertEq(system.cETH().balanceOf(alice), lendAmount);

        // Borrow
        vm.prank(bob);
        vm.assume(borrowAmount <= address(system).balance);
        uint256 bobInitialBalance = bob.balance;
        system.borrow(borrowAmount);
        assertEq(system.lETH().balanceOf(bob), borrowAmount);
        assertEq(bob.balance, bobInitialBalance + borrowAmount);

        // Redeem Liability
        vm.prank(bob);
        uint256 bobPreRedeemBalance = bob.balance;
        system.redeem(borrowAmount, false);
        assertEq(system.lETH().balanceOf(bob), 0);
        assertEq(bob.balance, bobPreRedeemBalance - borrowAmount);

        // Redeem Collateral
        vm.prank(alice);
        uint256 alicePreRedeemBalance = alice.balance;
        system.redeem(lendAmount, true);
        assertEq(system.cETH().balanceOf(alice), 0);
        assertEq(alice.balance, alicePreRedeemBalance + lendAmount);
    }
}
