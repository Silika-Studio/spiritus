import axios from "axios";
import fs from "fs";

import type { UploadCollectionTraits } from "../src/utils/types";

import * as dotenv from "dotenv";
dotenv.config();

export const uploadLayersURI = async (collection: string) => {
  const collectionTraits: UploadCollectionTraits = {
    rootHash: "",
    collectionName: `${collection}`,
    traits: {},
  };
  const relativeLayersFolder = `../layers/${collection}/`;
  let ipfsImageArray: { path: string; content: string }[] = [];
  var files = fs.readdirSync(__dirname + "/" + relativeLayersFolder);
  for (let i = 0; i < files.length; i++) {
    const currFile = files[i];
    console.log(currFile);
    const img = fs.readFileSync(`layers/${collection}/` + currFile, {
      encoding: "base64",
    });

    ipfsImageArray.push({
      path: currFile,
      content: img,
    });
  }

  try {
    const r = await axios.post<{ path: string }[]>(
      "https://deep-index.moralis.io/api/v2/ipfs/uploadFolder",
      ipfsImageArray,
      {
        headers: {
          "X-API-KEY": process.env.MORALIS_API_KEY!,
          "Content-Type": "application/json",
          accept: "application/json",
        },
      }
    );
    const aPath = r.data[0].path;
    const rootHash = aPath.substring(aPath.indexOf("/Qm")).split("/")[1];
    collectionTraits.rootHash = rootHash;

    r.data.forEach((data, index) => {
      const pathComponents = data.path.replace(".png", "").split("/");
      const fileCleaned = pathComponents[pathComponents.length - 1];
      const traitType = fileCleaned.split("-")[0];
      const traitValue = fileCleaned.replace(traitType + "-", "");

      if (!collectionTraits.traits[traitType])
        collectionTraits.traits[traitType] = [];

      collectionTraits.traits[traitType].push({
        id: index,
        value: traitValue,
        url: `ipfs://${rootHash}/${fileCleaned}.png`,
      });
    });
    console.log(r.data);
  } catch (e) {
    console.log(e);
  }

  const r = await axios.post<{ path: string }[]>(
    "https://deep-index.moralis.io/api/v2/ipfs/uploadFolder",
    [{ path: "layers.json", content: collectionTraits }],
    {
      headers: {
        "X-API-KEY": process.env.MORALIS_API_KEY!,
        "Content-Type": "application/json",
        accept: "application/json",
      },
    }
  );
  console.log(r.data);

  console.log(collectionTraits);
  return collectionTraits;
};
