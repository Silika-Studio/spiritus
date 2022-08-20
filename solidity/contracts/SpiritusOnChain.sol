// SPDX-License-Identifier: MIT

pragma solidity ^0.8.13;

/// @title: Spiritus On-Chain Example

import "erc721a/contracts/ERC721A.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract SpiritusOnChain is ERC721A, Ownable {
    string public tokenBaseURI;
    string public layersURI;

    // TODO Add Tableland tables

    event SetTokenBaseURI(string indexed tokenBaseURI);
    event SetLayersURI(string indexed layersURI);

    constructor(string memory _name, string memory _symbol)
        ERC721A(_name, _symbol)
    {}

    function mint(uint256 _quantity) external onlyOwner {
        _mint(msg.sender, _quantity);
    }

    function setTokenBaseURI(string memory _tokenBaseURI) external onlyOwner {
        tokenBaseURI = _tokenBaseURI;
        emit SetTokenBaseURI(tokenBaseURI);
    }

    function setLayersURI(string memory _layersURI) external onlyOwner {
        layersURI = _layersURI;
        emit SetLayersURI(layersURI);
    }

    function _baseURI() internal view virtual override returns (string memory) {
        return tokenBaseURI;
    }

    // TODO Override TokenURI to include Tableland tables
}
