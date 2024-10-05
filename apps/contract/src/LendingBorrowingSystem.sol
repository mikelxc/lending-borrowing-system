// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Burnable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract CollateralToken is ERC20, ERC20Burnable, Ownable {
    constructor(
        address _lendingSystem
    ) ERC20("Collateral ETH", "cETH") Ownable(_lendingSystem) {}

    function mint(address to, uint256 amount) external onlyOwner {
        _mint(to, amount);
    }

    function burnFrom(
        address account,
        uint256 amount
    ) public override onlyOwner {
        _burn(account, amount);
    }
}

contract LiabilityToken is ERC20, ERC20Burnable, Ownable {
    constructor(
        address _lendingSystem
    ) ERC20("Liability ETH", "lETH") Ownable(_lendingSystem) {}

    function mint(address to, uint256 amount) external onlyOwner {
        _mint(to, amount);
    }

    function burnFrom(
        address account,
        uint256 amount
    ) public override onlyOwner {
        _burn(account, amount);
    }
}

contract LendingBorrowingSystem is Ownable {
    CollateralToken public cETH;
    LiabilityToken public lETH;
    uint256 public constant BORROW_LIMIT = 0.05 ether;

    event Lent(address indexed user, uint256 amount);
    event Borrowed(address indexed user, uint256 amount);
    event Redeemed(address indexed user, uint256 amount, bool isCollateral);

    constructor() Ownable(msg.sender) {
        cETH = new CollateralToken(address(this));
        lETH = new LiabilityToken(address(this));
    }

    function lend() external payable {
        require(msg.value > 0, "Must send ETH to lend");
        cETH.mint(msg.sender, msg.value);
        emit Lent(msg.sender, msg.value);
    }

    function borrow(uint256 amount) external {
        require(amount <= BORROW_LIMIT, "Exceeds borrow limit");
        require(
            lETH.balanceOf(msg.sender) + amount <= BORROW_LIMIT,
            "Exceeds total borrow limit per wallet"
        );
        require(address(this).balance >= amount, "Not enough ETH in contract");

        lETH.mint(msg.sender, amount);
        payable(msg.sender).transfer(amount);
        emit Borrowed(msg.sender, amount);
    }

    function redeem(uint256 amount, bool isCollateral) external {
        if (isCollateral) {
            require(
                cETH.balanceOf(msg.sender) >= amount,
                "Insufficient cETH balance"
            );
            cETH.burnFrom(msg.sender, amount);
        } else {
            require(
                lETH.balanceOf(msg.sender) >= amount,
                "Insufficient lETH balance"
            );
            require(
                address(this).balance >= amount,
                "Not enough ETH in contract for redemption"
            );
            lETH.burnFrom(msg.sender, amount);
        }

        payable(msg.sender).transfer(amount);
        emit Redeemed(msg.sender, amount, isCollateral);
    }

    receive() external payable {}
}
