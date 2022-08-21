const { ethers, network } = require("hardhat");
const hre = require("hardhat");
const { TablelandTables, contractAddress } = require("./consts");

async function main() {
  const tablelandBaseURI = `https://testnet.tableland.network/query?mode=list&s=`;
  // Get the contract factory to create an instance of the TwoTablesNFT contract
  const Decoy = await ethers.getContractFactory("Decoy");
  // Deploy the contract, passing `tablelandBaseURI` in the constructor's `baseURI` and using the Tableland gateway
  // Also, pass the table's `name` to write to storage in the smart contract
  const decoy = await Decoy.deploy(
    tablelandBaseURI,
    TablelandTables.main,
    TablelandTables.attributes,
    TablelandTables.layers
  );
  await decoy.deployed();

  // Log the deployed address and call the getter on `baseURIString` (for demonstration purposes)
  console.log(
    `\nDecoy contract deployed on ${network.name} at: ${decoy.address}`
  );
  const baseURI = await decoy.tokenBaseURI();
  console.log(`Decoy is using baseURI: ${baseURI}`);

  try {
    console.log("\nVerifying contract...");
    await hre.run("verify:verify", {
      address: decoy.address,
      contract: "contracts/Decoy.sol:Decoy",
      constructorArguments: [
        tablelandBaseURI,
        TablelandTables.main,
        TablelandTables.attributes,
        TablelandTables.layers,
      ],
    });
  } catch (err: any) {
    if (err.message.includes("Reason: Already Verified")) {
      console.log(
        `Contract is already verified! Check it out on Polygonscan: https://mumbai.polygonscan.com/address/${decoy.address}`
      );
    }
  }
}

main();
