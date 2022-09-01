import axios from "axios";
import type {
  LoadCollectionTraits,
  IPFSLayer,
  UploadCollectionTraits,
} from "../utils/types";

export async function loadLayersFromIPFS() {
  const layers: LoadCollectionTraits = {
    layerHash: "QmPqF84LGToejXPpfD4TaKQykpUscpyjSvcWsCA7L7aKXh",
    collectionName: "goodmindsbread",
    traits: {},
  };

  const ipfsLayers: IPFSLayer[] = [];

  const ipfsGatewayUrl = "https://ipfs.moralis.io:2053/ipfs/";

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
