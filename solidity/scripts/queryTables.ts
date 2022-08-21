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
async function main() {
  const [signer] = await ethers.getSigners();
  const tableland = await connect({ signer, chain: "polygon-mumbai" });

  const mainTable = TablelandTables.main;
  const attributesTable = TablelandTables.attributes;
  const layersTable = TablelandTables.layers;

  const { columns: mc, rows: mr } = await tableland.read(
    `SELECT * FROM ${mainTable}`
  );
  console.log("Main Table");
  console.log(mc, mr);

  const { columns: ac, rows: ar } = await tableland.read(
    `SELECT * FROM ${attributesTable}`
  );
  console.log("Attributes Table");
  console.log(ac, ar);

  const { columns: lc, rows: lr } = await tableland.read(
    `SELECT * FROM ${layersTable}`
  );
  console.log("Layers Table");
  console.log(lc, lr);

  const { columns: jc, rows: jr } = await tableland.read(
    `SELECT json_object('id',spiritus_main_80001_1045.id,'name',name,'image',image,'description',description,'attributes',json_group_array(json_object('trait_type',trait_type,'value',value))) FROM spiritus_main_80001_1045 JOIN spiritus_attributes_80001_1046 ON spiritus_main_80001_1045.id = spiritus_attributes_80001_1046.main_id JOIN spiritus_layers_80001_1047 ON spiritus_layers_80001_1047.id = spiritus_attributes_80001_1046.layer_id WHERE spiritus_main_80001_1045.id=0 group by spiritus_main_80001_1045.id`
  );
  console.log("Joined Table");
  console.log(jc, jr);
  console.log(jr[0][0].attributes);
}

main();
