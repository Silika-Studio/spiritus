const globalAny: any = global;
// Standard `ethers` import for chain interaction, `network` for logging, and `run` for verifying contracts
const { ethers } = require("hardhat");
// The script required to upload metadata to IPFS
const { prepareSqlForTables } = require("./prepareSql");
// Import Tableland
const { connect } = require("@tableland/sdk");
// Import 'node-fetch' and set globally -- needed for Tableland to work with CommonJS
const fetch = (...args: [any]) =>
  import("node-fetch").then(({ default: fetch }) => fetch.apply(null, args));
globalAny.fetch = fetch;

require("@nomiclabs/hardhat-etherscan");

const { TablelandTables } = require("./consts");

async function main(
  id: number,
  traitType: string,
  oldValue: string,
  newValue: string
) {
  const [signer] = await ethers.getSigners();
  const tableland = await connect({ signer, chain: "polygon-mumbai" });

  const mainTable = TablelandTables.main;
  const attributesTable = TablelandTables.attributes;
  const layersTable = TablelandTables.layers;

  // Get info for all tables associated with your account
  const tables = await tableland.list();
  console.log(tables);

  const oldLayerId = await tableland.read(
    `SELECT id FROM ${layersTable} WHERE value = '${oldValue}' AND trait_type = '${traitType}'`
  );
  console.log(oldLayerId);

  const { newLayerId, newLayerURI } = await tableland.read(
    `SELECT id, uri FROM ${layersTable} WHERE value = '${newValue}' AND trait_type = '${traitType}'`
  );
  console.log(newLayerId, newLayerURI);

  let { hash: attrUpdateTxHash } = await tableland.write(
    `UPDATE ${attributesTable} SET layer_id = ${newLayerId} WHERE main_id = ${id} AND layer_id = ${oldLayerId}`
  );
  let receipt = tableland.receipt(attrUpdateTxHash);
  if (receipt) {
    console.log(`${attributesTable} table updated`);
  } else {
    throw new Error(
      `Write table error: could not get '${attributesTable}' transaction receipt: ${attrUpdateTxHash}`
    );
  }

  // TODO Generate new image, pin, and get CID

  const cid = "";

  const updateMainTable = await tableland.write(
    `UPDATE ${mainTable} SET image = '${cid}' WHERE main_id = ${id}'`
  );
  console.log(updateMainTable);
}

main(0, "", "", "")
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
