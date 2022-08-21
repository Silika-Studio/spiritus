// SPDX-License-Identifier: MIT

pragma solidity ^0.8.13;

import "erc721a/contracts/ERC721A.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Strings.sol";

contract Decoy is ERC721A, Ownable {
    /// A URI used to reference off-chain metadata.
    // This will use the Tableland gateway: https://testnet.tableland.network/query?mode=list&s=
    string public tokenBaseURI;

    string public layersURI;

    /// The name of the main metadata table in Tableland
    // Schema: id int primary key, name text, description text, image text
    string public mainTable;

    /// The name of the attributes table in Tableland
    // Schema: main_id int not null, trait_type text not null, value text
    string public attributesTable;

    string public layersTable;

    event SetTokenBaseURI(string indexed tokenBaseURI);
    event SetLayersURI(string indexed layersURI);

    constructor(
        string memory _tokenBaseURI,
        string memory _mainTable,
        string memory _attributesTable,
        string memory _layersTable
    ) ERC721A("SpiritusOffChain", "SOC") {
        tokenBaseURI = _tokenBaseURI;
        mainTable = _mainTable;
        attributesTable = _attributesTable;
        layersTable = _layersTable;
    }

    function mint(uint256 _quantity) external {
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

    function tokenURI(uint256 tokenId)
        public
        view
        virtual
        override
        returns (string memory)
    {
        require(
            _exists(tokenId),
            "ERC721Metadata: URI query for nonexistent token"
        );
        string memory baseURI = _baseURI();

        if (bytes(baseURI).length == 0) {
            return "";
        }

        /*
        A SQL query to JOIN three tables to compose the metadata accross a `main`, `attributes`, and `layers` table
        */
        string memory query = string.concat(
            "SELECT%20json_object%28%27id%27%2Cid%2C%27name%27%2Cname%2C%27description%27%2Cdescription%2C%27attributes%27%2Cjson_group_array%28json_object%28%27trait_type%27%2Ctrait_type%2C%27value%27%2Cvalue%29%29%29%20FROM%20",
            mainTable,
            "%20JOIN%20",
            attributesTable,
            "%20ON%20",
            mainTable,
            "%2Eid%20%3D%20",
            attributesTable,
            "%2Emain_id"
            "%20JOIN%20",
            layersTable,
            "%20ON%20",
            layersTable,
            "%2Eid%20%3D%20",
            attributesTable,
            "%2Elayer_id%20WHERE%20id%3D"
        );
        // Return the baseURI with a query string, which looks up the token id in a row.
        // `&mode=list` formats into the proper JSON object expected by metadata standards.
        // Using latest best practice `string.concat`
        return
            string.concat(
                baseURI,
                "&mode=list",
                query,
                Strings.toString(tokenId),
                "%20group%20by%20id"
            );
    }
}
