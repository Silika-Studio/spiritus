const { ethers, network } = require("hardhat");
const hre = require("hardhat");
const { TablelandTables, contractAddress } = require("./consts");

async function main() {
  const tablelandBaseURI = `https://testnet.tableland.network/query?mode=list&s=`;
  // Get the contract factory to create an instance of the TwoTablesNFT contract
  const Spiritus = await ethers.getContractFactory("Spiritus");
  // Deploy the contract, passing `tablelandBaseURI` in the constructor's `baseURI` and using the Tableland gateway
  // Also, pass the table's `name` to write to storage in the smart contract
  const sp = await Spiritus.deploy(
    TablelandTables.main,
    TablelandTables.attributes,
    TablelandTables.layers
  );
  await sp.deployed();

  // Log the deployed address and call the getter on `baseURIString` (for demonstration purposes)
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
