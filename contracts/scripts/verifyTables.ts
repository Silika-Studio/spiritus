const hre = require("hardhat");
require("@nomiclabs/hardhat-etherscan");
const dotenv = require("dotenv");
dotenv.config();

const { TablelandTables, contractAddress } = require("../utils/consts");

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
