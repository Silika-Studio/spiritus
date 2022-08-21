// General metadata for Ethereum
export let namePrefix = "Spiritus Nouns";
export let description = "Spiritus Nouns";
// export let baseUri = "ipfs://baseURI";

export const layerConfigurations = [
  {
    growEditionSizeTo: 5,
    layersOrder: [
      { name: "bg" },
      { name: "body" },
      { name: "head" },
      { name: "glasses" },
      { name: "accessory" },
    ],
  },
];

export const format = {
  width: 512,
  height: 512,
  smoothing: false,
};
