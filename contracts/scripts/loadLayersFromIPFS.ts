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
type IPFSLayer = {
  id: number;
  trait_type: string;
  value: string;
  filename: string;
};

const ipfsGatewayUrl = "https://ipfs.moralis.io:2053/ipfs/";

export async function loadLayersFromIPFS() {
  const layers: LoadCollectionTraits = {
    layerHash: "QmPqF84LGToejXPpfD4TaKQykpUscpyjSvcWsCA7L7aKXh",
    collectionName: "goodmindsbread",
    traits: {},
  };

  const ipfsLayers: IPFSLayer[] = [];

  const r = await axios.get<UploadCollectionTraits>(
    `${ipfsGatewayUrl}${layers.layerHash}/layers.json`
  );

  Object.entries(r.data.traits).forEach(([traitType, traits]) => {
    traits.forEach((trait, i) => {
      ipfsLayers.push({
        id: ipfsLayers.length,
        trait_type: traitType,
        value: trait.value,
        filename: trait.url,
      });
    });
  });

  return ipfsLayers;
}
