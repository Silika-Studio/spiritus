import axios from "axios";
import https from "https";
import sharp from "sharp";

require("dotenv").config({ path: require("find-config")(".env") });

const basePath = process.cwd();
const {
  format,
  description,
  layerConfigurations,
  namePrefix,
} = require(`${basePath}/utils/config.ts`);

let metadataList: any[] = [];
let attributesList: any[] = [];

const { createCanvas, loadImage } = require("canvas");
const canvas = createCanvas(format.width, format.height);
const ctx = canvas.getContext("2d");
const sha1 = require("sha1");
ctx.imageSmoothingEnabled = format.smoothing;
let dnaList = new Set();
const DNA_DELIMITER = "#";

interface LoadTraitType {
  value: string;
  url: string;
  data: Buffer;
}
type LoadCollectionTraits = {
  layerHash: string;
  collectionName: string;
  traits: Record<string, LoadTraitType[]>;
};

interface UploadTraitType {
  value: string;
  url: string;
}

type UploadCollectionTraits = {
  rootHash: string;
  collectionName: string;
  traits: Record<string, UploadTraitType[]>;
};

const ipfsGatewayUrl = "https://ipfs.moralis.io:2053/ipfs/";

const getIPFSElements = async (trait_value: string) => {
  const layers: LoadCollectionTraits = {
    layerHash: "QmPqF84LGToejXPpfD4TaKQykpUscpyjSvcWsCA7L7aKXh",
    collectionName: "goodmindsbread",
    traits: {},
  };
  const ipfsGatewayUrl = "https://ipfs.moralis.io:2053/ipfs/";
  const rootHash = "QmaXGHvtx4xt18sLGgMqMhM2Nt2E9czMz2xU9dZBRy56Wx";
  const r = await axios.get<UploadCollectionTraits>(
    `${ipfsGatewayUrl}${layers.layerHash}/layers.json`
  );

  let finals = r.data.traits[trait_value]
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

const loadLayerImg = async (_layer: any) => {
  try {
    return new Promise(async (resolve) => {
      const image = await loadImage(`${_layer.selectedElement.path}`);
      resolve({ layer: _layer, loadedImage: image });
    });
  } catch (error) {
    console.error("Error loading image:", error);
  }
};

const saveImage = (editionCount: number) => {};

const addMetadata = (_dna: string, _edition: number) => {
  let tempMetadata: any = {
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

const saveMetaDataSingleFile = (editionCount: number) => {
  let metadata = metadataList.find((meta: any) => meta.id == editionCount);
};

const cleanDna = (_str: string) => {
  const withoutOptions = removeQueryStrings(_str);
  let dna = Number(withoutOptions.split(":").shift());
  return dna;
};

const removeQueryStrings = (dna: string) => {
  const query = /(\?.*$)/;
  return dna.replace(query, "");
};

const drawElement = (_renderObject: any) => {
  ctx.globalAlpha = _renderObject.layer.opacity;
  ctx.globalCompositeOperation = _renderObject.layer.blend;

  ctx.drawImage(_renderObject.loadedImage, 0, 0, format.width, format.height);

  addAttributes(_renderObject);
};

const addAttributes = (_element: any) => {
  let selectedElement = _element.layer.selectedElement;
  attributesList.push({
    trait_type: _element.layer.name,
    value: selectedElement.name,
  });
};

const createDna = (_layers: any) => {
  let randNum: any[] = [];
  _layers.forEach((layer: any) => {
    let totalWeight = 0;
    layer.elements.forEach((element: any) => {
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

const isDnaUnique = (dnaList = new Set(), dna = "") => {
  const filteredDNA = filterDNAOptions(dna);
  return !dnaList.has(filteredDNA);
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

const constructLayerToDna = (_dna = "", _layers = []) => {
  let mappedDnaToLayers: any[] = _layers.map((layer: any, index) => {
    let selectedElement = layer.elements.find(
      (e: any) => e.id == cleanDna(_dna.split(DNA_DELIMITER)[index])
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

const layersSetup = async (layersOrder: any) => {
  const layers = layersOrder.map(async (layerObj: any, index: number) => ({
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
  }));
  return layers;
};

export const updateSingleAsset = async (
  newTraits: any,
  debug: boolean = false
) => {
  let layerConfigIndex = 0;
  let editionInd: number[] = [];
  const layers = await layersSetup(newTraits.attributes);
  let layerValues: any = await Promise.all(layers);

  let newDna = createDna(layerValues);
  if (isDnaUnique(dnaList, newDna)) {
    let results: any[] = constructLayerToDna(newDna, layerValues);
    let loadedElements: any[] = [];

    results.forEach((layer: any) => {
      loadedElements.push(loadLayerImg(layer));
    });

    await Promise.all(loadedElements).then((renderObjectArray) => {
      debug ? console.log("Clearing canvas") : null;
      ctx.clearRect(0, 0, format.width, format.height);
      renderObjectArray.forEach((renderObject) => {
        drawElement(renderObject);
      });
      saveImage(editionInd[0]);
      addMetadata(newDna, editionInd[0]);
      saveMetaDataSingleFile(editionInd[0]);
      console.log(
        `Created edition: ${editionInd[0]}, with DNA: ${sha1(newDna)}`
      );
    });
    dnaList.add(filterDNAOptions(newDna));
    editionInd.shift();
  } else {
    console.log("DNA exists! Try another trait");
  }
};
