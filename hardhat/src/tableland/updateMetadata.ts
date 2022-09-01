import { ethers } from "hardhat";
import { connect } from "@tableland/sdk";
import fs from "fs";
import path from "path";
import mime from "mime";
import { format } from "../utils/config";
import { TablelandTables } from "../utils/consts";

import * as dotenv from "dotenv";
dotenv.config();
const nftStorageApiKey = process.env.NFT_STORAGE_API_KEY;

const { NFTStorage, File } = require("nft.storage");

// Import 'node-fetch' and set globally -- needed for Tableland to work with CommonJS
const globalAny: any = global;
const fetch = (...args: [any]) =>
  import("node-fetch").then(({ default: fetch }) => fetch.apply(null, args));
globalAny.fetch = fetch;

import { createCanvas, loadImage } from "canvas";
const canvas = createCanvas(format.width, format.height);
const ctx = canvas.getContext("2d");
ctx.imageSmoothingEnabled = format.smoothing;

export async function updateAsset(
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

  const oldLayersTableId = await tableland.read(
    `SELECT id FROM ${layersTable} WHERE value = '${oldValue}' AND trait_type = '${traitType}'`
  );
  console.log(oldLayersTableId);

  const oldLayerId = oldLayersTableId.rows[0][0];

  const newLayersTableId = await tableland.read(
    `SELECT id FROM ${layersTable} WHERE value = '${newValue}' AND trait_type = '${traitType}'`
  );

  const newLayerId = newLayersTableId.rows[0][0];

  const { hash: attrUpdateTxHash } = await tableland.write(
    `UPDATE ${attributesTable} SET layer_id = ${newLayerId} WHERE main_id = ${id} AND layer_id = ${oldLayerId}`
  );
  let receipt = await tableland.receipt(attrUpdateTxHash);
  if (receipt) {
    console.log(`${attributesTable} table updated`);
  } else {
    throw new Error(
      `Write table error: could not get '${attributesTable}' transaction receipt: ${attrUpdateTxHash}`
    );
  }

  const { columns: a, rows: newLayers } = await tableland.read(
    `SELECT layer_id FROM ${attributesTable} WHERE main_id=${id}`
  );

  let layersToGenerate: any[] = [];
  for (let i = 0; i < newLayers.length; i++) {
    const newLayer = await tableland.read(
      `SELECT uri FROM ${layersTable} WHERE id=${newLayers[i][0]}`
    );
    layersToGenerate.push(newLayer.rows[0][0]);
  }

  const saveLayer = (_canvas: any) => {
    fs.writeFileSync(`./build/memory.png`, _canvas.toBuffer("image/png"));
  };

  const ipfsGatewayUrl = "https://ipfs.moralis.io:2053/ipfs/";
  const rootHash = "QmaXGHvtx4xt18sLGgMqMhM2Nt2E9czMz2xU9dZBRy56Wx";
  const drawLayer = async (_layer: any) => {
    const image = await loadImage(`${ipfsGatewayUrl}${rootHash}/${_layer}`);
    ctx.globalAlpha = 1;
    ctx.globalCompositeOperation = "source-over";

    ctx.drawImage(image, 0, 0, canvas.width, canvas.height);
  };

  async function fileFromPath(filePath: string) {
    const content = await fs.promises.readFile(filePath);
    const type = mime.getType(filePath);
    return new File([content], path.basename(filePath), { type });
  }

  const generatePinAndInsert = async (newTraits: any) => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    for (const layer of newTraits) {
      await drawLayer(layer);
    }
    saveLayer(canvas);
    console.log("Created image");
    const image = await fileFromPath("./build/memory.png");
    console.log(image);
    // Upload to IPFS using NFT Storage
    const storage = new NFTStorage({ token: nftStorageApiKey });
    const imageCid = await storage.storeBlob(image);
    // Return the image's CID
    console.log(`New CID: ${imageCid}`);

    const newURI = `https://${imageCid}.ipfs.nftstorage.link/`;
    // Update main table
    const { hash: mainUpdateTxHash } = await tableland.write(
      `UPDATE ${mainTable} SET image = '${newURI}' WHERE id = ${id}`
    );
    let receipt = await tableland.receipt(mainUpdateTxHash);
    if (receipt) {
      console.log(`${mainTable} table updated`);
    } else {
      throw new Error(
        `Write table error: could not get '${mainTable}' transaction receipt: ${mainUpdateTxHash}`
      );
    }
  };

  await generatePinAndInsert(layersToGenerate);
}

updateAsset(0, "background", "arizona", "blue");
