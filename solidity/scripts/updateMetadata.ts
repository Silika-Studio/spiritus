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

  // Read all records in the main table
  const { columns: mc, rows: mr } = await tableland.read(
    `SELECT * FROM ${mainTable}`
  );
  console.log(mc, mr);

  // Read all records in the attributes table
  const { columns: ac, rows: ar } = await tableland.read(
    `SELECT * FROM ${attributesTable}`
  );
  console.log(ac, ar);

  // Read all records in the layers table
  const { columns: lc, rows: lr } = await tableland.read(
    `SELECT * FROM ${layersTable}`
  );
  console.log(lc, lr);

  const oldLayerId = await tableland.read(
    `SELECT layer_id FROM ${layersTable} WHERE value = '${oldValue}' AND trait_type = '${traitType}'`
  );
  console.log(oldLayerId);

  const { newLayerId, newLayerURI } = await tableland.read(
    `SELECT layer_id, layer_uri FROM ${layersTable} WHERE value = '${newValue}' AND trait_type = '${traitType}'`
  );
  console.log(newLayerId, newLayerURI);

  const updateAttributesTable = await tableland.write(
    `UPDATE ${attributesTable} SET layer_id = ${newLayerId} WHERE main_id = ${id} AND layer_id = ${oldLayerId}`
  );
  console.log(updateAttributesTable);

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
