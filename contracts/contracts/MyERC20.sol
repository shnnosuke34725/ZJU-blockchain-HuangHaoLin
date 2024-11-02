// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract MyERC20 is ERC20 {
    uint256 public rate = 1000;

    constructor(string memory name, string memory symbol) ERC20(name, symbol) {
    }

    // 用户兑换积分
    function exchangeEtherForPoints() public payable {
        require(msg.value > 0, "Send ETH to exchange for points");
        uint256 pointsToMint = msg.value * rate;
        _mint(msg.sender, pointsToMint);
    }
}
