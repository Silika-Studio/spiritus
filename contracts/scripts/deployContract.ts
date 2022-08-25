// Contract deployment is available in `deployTables.ts`. This script can be used for existing tables or if
// contract deployment fails after creating the tables.

import { ethers, network } from "hardhat";
import { TablelandTables } from "../utils/consts";

async function main() {
  // Get the contract factory to create an instance of the contract
  const Spiritus = await ethers.getContractFactory("Spiritus");
  // Deploy the contract, passing the table's `name` to write to storage in the smart contract
  const sp = await Spiritus.deploy(
    TablelandTables.main,
    TablelandTables.attributes,
    TablelandTables.layers
  );
  await sp.deployed();

  // Log the deployed address and call the tokenBaseURI() getter
  console.log(`\nDecoy contract deployed on ${network.name} at: ${sp.address}`);
  const baseURI = await sp.tokenBaseURI();
  console.log(`Decoy is using baseURI: ${baseURI}`);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
