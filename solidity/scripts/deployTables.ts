const globalAny: any = global;
// Standard `ethers` import for blockchain operations, plus `network` for logging the flagged network
const { ethers, network } = require("hardhat");
const hre = require("hardhat");
// The script required to upload metadata to IPFS
const { prepareSql } = require("./prepareSql");
// Import Tableland
const { connect } = require("@tableland/sdk");
// Import 'node-fetch' and set globally -- needed for Tableland to work with CommonJS
const fetch = (...args: [any]) =>
  import("node-fetch").then(({ default: fetch }) => fetch.apply(null, args));
globalAny.fetch = fetch;
// Optionally, do contract verification (for demo purposes, but this could be as a separate script `verify.js`)
require("@nomiclabs/hardhat-etherscan");

async function main() {
  // Define the account that will be signing txs for table creates/writes & contract deployment
  const [signer] = await ethers.getSigners();

  // Connect to Tableland
  const tableland = await connect({ signer, chain: "polygon-mumbai" });
  // Define the 'main' table's schema as well as the 'attributes' table; a primary key should exist
  // Recall that declaring a primary key must have a unique combination of values in its primary key columns
  const mainSchema = `id int primary key, name text, description text, image text, hash text`;
  // Should have one `main` row (a token) to many `attributes`, so no need to introduce a primary key constraint
  const attributesSchema = `main_id int not null, layer_id int not null`;
  // Holds the attribute data and related uri for the layer
  const layersSchema = `id int primary key, trait_type text not null, value text, uri text`;
  // Define the (optional) prefix, noting the main & attributes tables
  const mainPrefix = "spiritus_main";
  const attributesPrefix = "spiritus_attributes";
  const layersPrefix = "spiritus_layers";

  // Create the main table and retrieve its returned `name` and on-chain tx as `txnHash`
  const { name: mainName, txnHash: mainTxnHash } = await tableland.create(
    mainSchema,
    { prefix: mainPrefix }
  );
  // Wait for the main table to be "officially" created (i.e., tx is included in a block)
  // If you do not, you could be later be inserting into a non-existent table
  let receipt = tableland.receipt(mainTxnHash);
  if (receipt) {
    console.log(`Table '${mainName}' has been created at tx '${mainTxnHash}'`);
  } else {
    throw new Error(
      `Create table error: could not get '${mainName}' transaction receipt: ${mainTxnHash}`
    );
  }

  // Create the attributes table and retrieve its returned `name` and on-chain tx as `txnHash`
  const { name: attributesName, txnHash: attributesTxnHash } =
    await tableland.create(attributesSchema, {
      prefix: attributesPrefix,
    });
  // Wait for the attributes table to be "officially" created
  // If you do not, you could be later be inserting into a non-existent table
  receipt = tableland.receipt(attributesTxnHash);
  if (receipt) {
    console.log(
      `Table '${attributesName}' has been created at tx '${attributesTxnHash}'`
    );
  } else {
    throw new Error(
      `Create table error: could not get '${attributesName}' transaction receipt: ${attributesTxnHash}`
    );
  }

  // Create the layers table and retrieve its returned `name` and on-chain tx as `txnHash`
  const { name: layersName, txnHash: layersTxnHash } = await tableland.create(
    layersSchema,
    {
      prefix: layersPrefix,
    }
  );
  // Wait for the attributes table to be "officially" created
  // If you do not, you could be later be inserting into a non-existent table
  receipt = tableland.receipt(layersTxnHash);
  if (receipt) {
    console.log(
      `Table '${layersName}' has been created at tx '${layersTxnHash}'`
    );
  } else {
    throw new Error(
      `Create table error: could not get '${layersName}' transaction receipt: ${layersTxnHash}`
    );
  }

  // Prepare the SQL INSERT statements, which pass the table names to help prepare the statements
  // It returns an object with keys `main` (a single statement) and `attributes` (an array of statements)
  // That is, many `attributes` can be inserted for every 1 entry/row in `main`

  const [sqlInsertStatements, layersStatements] = await prepareSql(
    mainName,
    attributesName,
    layersName
  );

  // Insert metadata into the 'main', 'attributes', and `layers`tables, before smart contract deployment
  console.log(`\nWriting metadata to tables...`);
  for await (let statement of sqlInsertStatements) {
    const { main, attributes } = statement;
    // Call `write` with both INSERT statements; optionally, log it to show some SQL queries
    // Use `receipt` to make sure everything worked as expected
    let { hash: mainWriteTx } = await tableland.write(main);
    receipt = tableland.receipt(mainWriteTx);
    if (receipt) {
      console.log(`${mainName} table: ${main}`);
    } else {
      throw new Error(
        `Write table error: could not get '${mainName}' transaction receipt: ${mainWriteTx}`
      );
    }
    // Recall that `attributes` is an array of SQL statements for each `trait_type` and `value` for a `tokenId`
    for await (let attribute of attributes) {
      let { hash: attrWriteTx } = await tableland.write(attribute);
      receipt = tableland.receipt(attrWriteTx);
      if (receipt) {
        console.log(`${attributesName} table: ${attribute}`);
      } else {
        throw new Error(
          `Write table error: could not get '${attributesName}' transaction receipt: ${attrWriteTx}`
        );
      }
    }
  }

  // Insert into Layers table
  for await (let layer of layersStatements) {
    let { hash: layerWriteTx } = await tableland.write(layer);
    receipt = tableland.receipt(layerWriteTx);
    if (receipt) {
      console.log(`${layersName} table: ${layer}`);
    } else {
      throw new Error(
        `Write table error: could not get '${layersName}' transaction receipt: ${layerWriteTx}`
      );
    }
  }

  // Set the Tableand gateway as the `baseURI` where a `tokenId` will get appended upon `tokenURI` calls
  // Note that `mode=list` will format the metadata per the ERC721 standard
  const tablelandBaseURI = `https://testnet.tableland.network/query?mode=list&s=`;
  // Get the contract factory to create an instance of the TwoTablesNFT contract
  const Decoy = await ethers.getContractFactory("Decoy");
  // Deploy the contract, passing `tablelandBaseURI` in the constructor's `baseURI` and using the Tableland gateway
  // Also, pass the table's `name` to write to storage in the smart contract
  const decoy = await Decoy.deploy(mainName, attributesName, layersName);
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
        mainName,
        attributesName,
        layersName,
      ],
    });
  } catch (err: any) {
    if (err.message.includes("Reason: Already Verified")) {
      console.log(
        `Contract is already verified! Check it out on Polygonscan: https://mumbai.polygonscan.com/address/${decoy.address}`
      );
    }
  }

  // For demonstration purposes, mint a token so that `tokenURI` can be called
  const mintToken = await decoy.mint();
  const mintTxn = await mintToken.wait();
  // For demonstration purposes, retrieve the event data from the mint to get the minted `tokenId`
  const mintReceipient = mintTxn.events[0].args[1];
  const tokenId = mintTxn.events[0].args[2];
  console.log(
    `NFT minted: tokenId '${tokenId.toNumber()}' to owner '${mintReceipient}'`
  );
  const tokenURI = await decoy.tokenURI(tokenId);
  console.log(
    `\nSee an example of 'tokenURI' using token '${tokenId}' here:\n${tokenURI}`
  );
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
