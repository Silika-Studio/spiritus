import axios from "axios";

interface UploadTraitType {
  value: string;
  url: string;
}

type UploadCollectionTraits = {
  rootHash: string;
  collectionName: string;
  traits: Record<string, UploadTraitType[]>;
};

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

const ipfsGatewayUrl = "https://ipfs.moralis.io:2053/ipfs/";

async function loadLayersFromIPFS() {
  const layers: LoadCollectionTraits = {
    layerHash: "QmZ6mcScDMKiYt49fddbMzFwmfmc6os2a7QsbeJ7ocZP2M",
    collectionName: "nouns",
    traits: {},
  };

  const allLayers: any[] = [];
  const r = await axios.get<UploadCollectionTraits>(
    `${ipfsGatewayUrl}${layers.layerHash}/layers.json`
  );

  Object.entries(r.data.traits).forEach(([traitType, traits]) => {
    traits.forEach((trait, i) => {
      allLayers.push({
        id: allLayers.length,
        trait_type: traitType,
        value: trait.value,
        uri: trait.url,
      });
    });
  });

  return allLayers;
}

export = loadLayersFromIPFS;
