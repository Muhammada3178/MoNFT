// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import { ERC721 } from "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import { Ownable } from "@openzeppelin/contracts/access/Ownable.sol";
contract MoNFT is ERC721, Ownable {
    uint256 public maxSupply = 10000;
    uint256 public mintPrice = 0.1 ether;
    uint256 public currentSupply = 0;
    constructor() ERC721("MoNFT", "MNFT") Ownable(msg.sender) {}
    function mint() external payable {
        // Check if the current supply has reached the max supply
        require(currentSupply < maxSupply, "Max supply reached");
        // Check if the sender has sent the correct mint price
        require(msg.value == mintPrice, "Incorrect mint price");
        // Mint a new token
        _safeMint(msg.sender, currentSupply);
        // Increment the current supply
        currentSupply++;
    }
}

