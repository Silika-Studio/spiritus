// Standard `ethers` import for blockchain operations, plus `network` for logging the flagged network
import { ethers, network } from "hardhat";
const hre = require("hardhat");
require("@nomiclabs/hardhat-etherscan");
const dotenv = require("dotenv");
dotenv.config();

const { TablelandTables, contractAddress } = require("./consts");

async function main() {
  await hre.run("verify:verify", {
    address: contractAddress, // Update with your contract address
    contract: "contracts/Spiritus.sol:Spiritus",
    constructorArguments: [
      TablelandTables.main,
      TablelandTables.attributes,
      TablelandTables.layers,
    ],
  });
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
