import fs from "fs";
import path from "path";
import mime from "mime";
import * as dotenv from "dotenv";
dotenv.config();

import { createNFT } from "../../scripts/generateAssets";

import type { Metadata } from "../utils/types";

const { getFilesFromPath } = require("files-from-path");
const { NFTStorage, File } = require("nft.storage");
const nftStorageApiKey = process.env.NFT_STORAGE_API_KEY;

const basePath = process.cwd();
const buildDir = `${basePath}/build`;

/**
 * Helper to retrieve a single file from some path.
 * @param {string} filePath The path of a file to retrieve.
 * @returns {File} A fs File at the specified file path.
 */
async function fileFromPath(filePath: string) {
  const content = await fs.promises.readFile(filePath);
  const type = mime.getType(filePath);
  return new File([content], path.basename(filePath), { type });
}

/**
 * Upload the image to IPFS and return its CID.
 * @param {number} id The id of the NFT, matching with the `images` and `metadata` directories.
 * @param {string} imagesDirPath The `path` to the directory of images.
 * @returns {string} Resulting CID from pushing the image to IPFS.
 */
async function uploadImageToIpfs(id: number, imagesDirPath: string) {
  // Find & load the file from disk
  const imagePath = path.join(imagesDirPath, `${id}.png`);
  const image = await fileFromPath(imagePath);
  // Upload to IPFS using NFT Storage
  const storage = new NFTStorage({ token: nftStorageApiKey });
  const imageCid = await storage.storeBlob(image);
  // Return the image's CID
  return imageCid;
}

/**
 * Update the existing metadata file, changing the 'image' to the `{imageCid}` interpolated in the NFT.Storage gateway URL.
 * @param {number} id The id of the NFT, matching with the `images` and `metadata` directories.
 * @param {string} metadataDirPath The `path` to the metadata directory of JSON files.
 * @param {string} imagesDirPath The `path` to the images directory of JSON files.
 * @returns {Object} Object of parsed metadata JSON file with CID written to 'image' field.
 */
async function parseMetadataFile(
  id: number,
  metadataDirPath: string,
  imagesDirPath: string
) {
  // Retrieve CID from uploaded image file
  const imageCid = await uploadImageToIpfs(id, imagesDirPath);
  // Find the corresponding metadata file (matching `id`)
  const metadataFilePath = path.join(metadataDirPath, `${id}.json`);

  let metadataFile;

  try {
    metadataFile = await fs.promises.readFile(metadataFilePath);
  } catch (error) {
    console.error(`Error reading file in metadata directory: ${id}.json`);
  }
  // Parse metatadata buffer (from 'readFile') to an object
  const metadataJson: Metadata = JSON.parse(metadataFile.toString());
  // Overwrite the empty 'image' with the IPFS CID at the NFT.Storage gateway
  metadataJson.image = `https://${imageCid}.ipfs.nftstorage.link/`;
  // Write the file to the metadata directory. This is not essential for Tableland
  // purposes, but it's handy to see what the output looks like for those coming
  // from background where metadata files are deployed on IPFS, not just images.
  const metadataFileBuffer = Buffer.from(JSON.stringify(metadataJson));
  try {
    await fs.promises.writeFile(metadataFilePath, metadataFileBuffer);
  } catch (error) {
    console.error(`Error writing file in metadata directory: ${id}.json`);
  }

  // Return metadata as an object
  return metadataJson;
}

/**
 * Prepare metadata as an array of metadata objects.
 * @returns {Array<Object>} Metadata files parsed to objects, including the overwritten `image` with a CID.
 */
export async function prepareMetadata() {
  await createNFT(2);
  // An array that contains all metadata objects
  const finalMetadata: Metadata[] = [];
  // Set the `metadata` & `images` directory path, holding the metadata files & images
  const metadataDirPath = `${buildDir}/metadata`;
  const imagesDirPath = `${buildDir}/images`;
  // Retrieve the updated files -- pass the metadata directory and strip off the `metadata` prefix, leaving only the file name
  const metadataFiles = await getFilesFromPath(metadataDirPath, {
    pathPrefix: path.resolve(metadataDirPath),
  });
  for (const file of metadataFiles) {
    // Strip the leading `/` from the file's `name`, which is
    let id: number = file.name.replace(/\.[^/.]+$/, "");
    try {
      // Retrieve the metadata files as an object, parsed from the metadata files
      let metadataObj = await parseMetadataFile(
        id,
        metadataDirPath,
        imagesDirPath
      );
      console.log(`Successfully pinned image to ${metadataObj.image}`);
      finalMetadata.push(metadataObj);
    } catch (error) {
      console.error(`Error parsing metadata file: ${id}`);
    }
  }

  // Return metadata files
  return finalMetadata;
}
