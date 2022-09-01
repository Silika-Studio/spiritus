import { ethers } from "hardhat";
import { connect } from "@tableland/sdk";
import { TablelandTables } from "../utils/consts";

// Import 'node-fetch' and set globally -- needed for Tableland to work with CommonJS
const globalAny: any = global;
const fetch = (...args: [any]) =>
  import("node-fetch").then(({ default: fetch }) => fetch.apply(null, args));
globalAny.fetch = fetch;

async function main() {
  const [signer] = await ethers.getSigners();
  const tableland = await connect({ signer, chain: "polygon-mumbai" });

  // Tableland tables to query
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
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
