import { ethers } from "hardhat";
import { connect } from "@tableland/sdk";
import { prepareSql } from "./prepareSql";

// Import 'node-fetch' and set globally -- needed for Tableland to work with CommonJS
const fetch = (...args: [any]) =>
  import("node-fetch").then(({ default: fetch }) => fetch.apply(null, args));
const globalAny: any = global;
globalAny.fetch = fetch;

async function main() {
  const [signer] = await ethers.getSigners();

  const tableland = await connect({ signer, chain: "polygon-mumbai" });
  // 'main' table schema
  const mainSchema = `id int primary key, name text, description text, image text, hash text`;
  // 'attributes' table schema
  const attributesSchema = `main_id int not null, layer_id int not null`;
  // 'layers' schema
  const layersSchema = `id int primary key, trait_type text not null, value text, filename text`;
  // Define the (optional) prefixes, noting the main & attributes tables
  const mainPrefix = "spiritusMain";
  const attributesPrefix = "spiritusAttributes";
  const layersPrefix = "spiritusLayers";

  // Create the 'main' table and retrieve its returned `name` and on-chain tx as `txnHash`
  const { name: mainName, txnHash: mainTxnHash } = await tableland.create(
    mainSchema,
    { prefix: mainPrefix }
  );
  // Wait for the 'main' table to be "officially" created (i.e., tx is included in a block)
  // If you do not, you could be later be inserting into a non-existent table
  let receipt = await tableland.receipt(mainTxnHash);
  if (receipt) {
    console.log(`Table '${mainName}' has been created at tx '${mainTxnHash}'`);
  } else {
    throw new Error(
      `Create table error: could not get '${mainName}' transaction receipt: ${mainTxnHash}`
    );
  }

  // Create the 'attributes' table and retrieve its returned `name` and on-chain tx as `txnHash`
  const { name: attributesName, txnHash: attributesTxnHash } =
    await tableland.create(attributesSchema, {
      prefix: attributesPrefix,
    });
  // Wait for the 'attributes' table to be "officially" created
  // If you do not, you could be later be inserting into a non-existent table
  receipt = await tableland.receipt(attributesTxnHash);
  if (receipt) {
    console.log(
      `Table '${attributesName}' has been created at tx '${attributesTxnHash}'`
    );
  } else {
    throw new Error(
      `Create table error: could not get '${attributesName}' transaction receipt: ${attributesTxnHash}`
    );
  }

  // Create the 'layers' table and retrieve its returned `name` and on-chain tx as `txnHash`
  const { name: layersName, txnHash: layersTxnHash } = await tableland.create(
    layersSchema,
    {
      prefix: layersPrefix,
    }
  );
  // Wait for the 'layers' table to be "officially" created
  // If you do not, you could be later be inserting into a non-existent table
  receipt = await tableland.receipt(layersTxnHash);
  if (receipt) {
    console.log(
      `Table '${layersName}' has been created at tx '${layersTxnHash}'`
    );
  } else {
    throw new Error(
      `Create table error: could not get '${layersName}' transaction receipt: ${layersTxnHash}`
    );
  }

  const { mainAndAttributesStatements, layersStatements } = await prepareSql(
    mainName,
    attributesName,
    layersName
  );

  // Insert metadata into the 'main' and 'attributes' tables, before smart contract deployment
  console.log(`\nWriting metadata to tables...`);
  for await (let statement of mainAndAttributesStatements) {
    const { main, attributes } = statement;

    let { hash: mainWriteTx } = await tableland.write(main);
    receipt = await tableland.receipt(mainWriteTx);
    if (receipt) {
      console.log(`${mainName} table: ${main}`);
    } else {
      throw new Error(
        `Write table error: could not get '${mainName}' transaction receipt: ${mainWriteTx}`
      );
    }

    for await (let attribute of attributes) {
      let { hash: attrWriteTx } = await tableland.write(attribute);
      receipt = await tableland.receipt(attrWriteTx);
      if (receipt) {
        console.log(`${attributesName} table: ${attribute}`);
      } else {
        throw new Error(
          `Write table error: could not get '${attributesName}' transaction receipt: ${attrWriteTx}`
        );
      }
    }
  }

  // Insert into 'layers' table before smart contract deployment
  for await (let layer of layersStatements) {
    let { hash: layerWriteTx } = await tableland.write(layer);
    receipt = await tableland.receipt(layerWriteTx);
    if (receipt) {
      console.log(`${layersName} table: ${layer}`);
    } else {
      throw new Error(
        `Write table error: could not get '${layersName}' transaction receipt: ${layerWriteTx}`
      );
    }
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
