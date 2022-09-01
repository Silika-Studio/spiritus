const hre = require("hardhat");
import "@nomiclabs/hardhat-etherscan";
import * as dotenv from "dotenv";
dotenv.config();

import { TablelandTables, contractAddress } from "./utils/consts";

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
