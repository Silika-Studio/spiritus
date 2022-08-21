// General metadata for Ethereum
export let namePrefix = "Good Minds";
export let description = "Good Minds Breads";
// export let baseUri = "ipfs://baseURI";

export const layerConfigurations = [
  {
    growEditionSizeTo: 5,
    // Good minds bread
    layersOrder: [{ name: "background" }, { name: "body" }, { name: "face" }],
  },
];

export const format = {
  width: 512,
  height: 512,
  smoothing: false,
};
