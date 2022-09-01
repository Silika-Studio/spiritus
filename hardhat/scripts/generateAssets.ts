import * as dotenv from "dotenv";
dotenv.config();
import path from "path";
import fs from "fs";
import sha1 from "sha1";
import mime from "mime";
import { createCanvas, loadImage } from "canvas";
import axios from "axios";
import {
  format,
  layerConfigurations,
  namePrefix,
  description,
} from "../src/utils/config";
import type {
  Attribute,
  Metadata,
  DNALayer,
  LoadCollectionTraits,
  UploadCollectionTraits,
  Layer,
  LayerConfig,
  IPFSLayerForArtEngine,
} from "../src/utils/types";

const { NFTStorage, File } = require("nft.storage");
const nftStorageApiKey = process.env.NFT_STORAGE_API_KEY;

const basePath = process.cwd();
const buildDir = `${basePath}/build`;

// Canvas setup
const canvas = createCanvas(format.width, format.height);
const ctx = canvas.getContext("2d");
ctx.imageSmoothingEnabled = format.smoothing;

let metadataList: Metadata[] = [];
let attributesList: Attribute[] = [];
let dnaList = new Set();
const DNA_DELIMITER = "#";

const removeQueryStrings = (dna: string) => {
  const query = /(\?.*$)/;
  return dna.replace(query, "");
};

const cleanDna = (_str: string) => {
  const withoutOptions = removeQueryStrings(_str);
  let dna = Number(withoutOptions.split(":").shift());
  return dna;
};

const getIPFSElements = async (trait_value: string) => {
  const layers: LoadCollectionTraits = {
    layerHash: "QmPqF84LGToejXPpfD4TaKQykpUscpyjSvcWsCA7L7aKXh",
    collectionName: "",
    traits: {},
  };
  const ipfsGatewayUrl = "https://ipfs.moralis.io:2053/ipfs/";
  const rootHash = "QmaXGHvtx4xt18sLGgMqMhM2Nt2E9czMz2xU9dZBRy56Wx";
  const r = await axios.get<UploadCollectionTraits>(
    `${ipfsGatewayUrl}${layers.layerHash}/layers.json`
  );

  let finals: IPFSLayerForArtEngine[] = r.data.traits[trait_value]
    .filter((item: any) => !/(^|\/)\.[^\/\.]/g.test(item))
    .map((layer: any, index: number) => {
      return {
        id: index,
        name: layer.value,
        filename: layer.value,
        path: `${ipfsGatewayUrl}${rootHash}/${layer.url}`,
        weight: 3,
      };
    });
  return finals;
};

const saveImage = (editionCount: number) => {
  fs.writeFileSync(
    `${buildDir}/images/${editionCount}.png`,
    canvas.toBuffer("image/png")
  );
};

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

const pinImageToIPFS = async (editionCount: number) => {
  const imagePath = `${buildDir}/images/${editionCount}.png`;
  const image = await fileFromPath(imagePath);
  // Upload to IPFS using NFT Storage
  const storage = new NFTStorage({ token: nftStorageApiKey });
  const imageCid = await storage.storeBlob(image);
  // Return the image's CID
  return imageCid;
};

const addMetadata = (_dna: string, _edition: number) => {
  let tempMetadata: Metadata = {
    id: _edition,
    name: `${namePrefix} #${_edition}`,
    description: description,
    image: "",
    hash: sha1(_dna),
    attributes: attributesList,
  };

  metadataList.push(tempMetadata);
  attributesList = [];
};

const addAttributes = (_element: any) => {
  let selectedElement = _element.layer.selectedElement;
  attributesList.push({
    trait_type: _element.layer.name,
    value: selectedElement.name,
  });
};

const loadLayerImg = async (_layer: DNALayer) => {
  try {
    const image = await loadImage(`${_layer.selectedElement.path}`);
    return { layer: _layer, loadedImage: image };
  } catch (error) {
    console.error("Error loading image:", error);
  }
};

const drawElement = (_renderObject: any) => {
  ctx.globalAlpha = _renderObject.layer.opacity;
  ctx.globalCompositeOperation = _renderObject.layer.blend;

  ctx.drawImage(_renderObject.loadedImage, 0, 0, format.width, format.height);

  addAttributes(_renderObject);
};

const layersSetup = async (layersOrder: LayerConfig[]) => {
  const layers = layersOrder.map(
    async (layerObj: LayerConfig, index: number) => ({
      id: index,
      elements: await getIPFSElements(`${layerObj.name}`),

      name:
        layerObj.options?.["displayName"] != undefined
          ? layerObj.options?.["displayName"]
          : layerObj.name,
      blend:
        layerObj.options?.["blend"] != undefined
          ? layerObj.options?.["blend"]
          : "source-over",
      opacity:
        layerObj.options?.["opacity"] != undefined
          ? layerObj.options?.["opacity"]
          : 1,
      bypassDNA:
        layerObj.options?.["bypassDNA"] !== undefined
          ? layerObj.options?.["bypassDNA"]
          : false,
    })
  );
  return layers;
};

const constructLayerToDna = (_dna = "", _layers: Layer[] = []) => {
  let mappedDnaToLayers: DNALayer[] = _layers.map((layer: Layer, index) => {
    let selectedElement = layer.elements.find(
      (e: IPFSLayerForArtEngine) =>
        e.id == cleanDna(_dna.split(DNA_DELIMITER)[index])
    );
    return {
      name: layer.name,
      blend: layer.blend,
      opacity: layer.opacity,
      selectedElement: selectedElement,
    };
  });
  return mappedDnaToLayers;
};

const filterDNAOptions = (_dna: any) => {
  const dnaItems = _dna.split(DNA_DELIMITER);
  const filteredDNA = dnaItems.filter((element: any) => {
    const query = /(\?.*$)/;
    const querystring = query.exec(element);
    if (!querystring) {
      return true;
    }
    const options: any = querystring[1].split("&").reduce((r, setting) => {
      const keyPairs = setting.split("=");
      return { ...r, [keyPairs[0]]: keyPairs[1] };
    }, []);

    return options.bypassDNA;
  });

  return filteredDNA.join(DNA_DELIMITER);
};

const isDnaUnique = (dnaList = new Set(), dna = "") => {
  const filteredDNA = filterDNAOptions(dna);
  return !dnaList.has(filteredDNA);
};

const createDna = (_layers: Layer[]) => {
  let randNum: string[] = [];
  _layers.forEach((layer: Layer) => {
    let totalWeight = 0;
    layer.elements.forEach((element: IPFSLayerForArtEngine) => {
      totalWeight += element.weight;
    });
    // number between 0 - totalWeight
    let random = Math.floor(Math.random() * totalWeight);
    for (let i = 0; i < layer.elements.length; i++) {
      // subtract the current weight from the random weight until we reach a sub zero value.
      random -= layer.elements[i].weight;
      if (random < 0) {
        return randNum.push(
          `${layer.elements[i].id}:${layer.elements[i].filename}${
            layer.bypassDNA ? "?bypassDNA=true" : ""
          }`
        );
      }
    }
  });
  return randNum.join(DNA_DELIMITER);
};

const saveMetaDataSingleFile = (editionCount: number, debug = false) => {
  let metadata = metadataList.find((meta: Metadata) => meta.id == editionCount);
  debug
    ? console.log(
        `Writing metadata for ${editionCount}: ${JSON.stringify(metadata)}`
      )
    : null;
  fs.writeFileSync(
    `${buildDir}/metadata/${editionCount}.json`,
    JSON.stringify(metadata, null, 2)
  );
};

export const createNFT = async (
  editionSize: number,
  debug: boolean = false,
  dnaTolerance: number = 10000
) => {
  let layerConfigIndex = 0;
  let editionCount = 1;
  let failedCount = 0;
  let editionInd: number[] = [];
  for (let i = 0; i < editionSize; i++) {
    editionInd.push(i);
  }
  debug ? console.log("Editions left to create: ", editionInd) : null;
  while (layerConfigIndex < layerConfigurations.length) {
    const layers = await layersSetup(
      layerConfigurations[layerConfigIndex].layersOrder
    );

    let layerValues: Layer[] = await Promise.all(layers);

    while (editionCount <= editionSize) {
      let newDna = createDna(layerValues);
      if (isDnaUnique(dnaList, newDna)) {
        let results: DNALayer[] = constructLayerToDna(newDna, layerValues);
        let loadedElements: any[] = [];

        results.forEach((layer: DNALayer) => {
          loadedElements.push(loadLayerImg(layer));
        });

        await Promise.all(loadedElements).then((renderObjectArray: Layer[]) => {
          debug ? console.log("Clearing canvas") : null;
          ctx.clearRect(0, 0, format.width, format.height);
          renderObjectArray.forEach((renderObject: Layer) => {
            drawElement(renderObject);
          });
          debug ? console.log("Editions left to create: ", editionInd) : null;
          saveImage(editionInd[0]);
          addMetadata(newDna, editionInd[0]);
          saveMetaDataSingleFile(editionInd[0], debug);
          console.log(
            `Created edition: ${editionInd[0]}, with DNA: ${sha1(newDna)}`
          );
        });
        dnaList.add(filterDNAOptions(newDna));
        editionCount++;
        editionInd.shift();
      } else {
        console.log("DNA exists!");
        failedCount++;
        if (failedCount >= dnaTolerance) {
          console.log(`Not enough layers for collection size: ${editionSize}`);
          process.exit();
        }
      }
    }
    layerConfigIndex++;
  }
};

createNFT(2);
