// General metadata for Ethereum
const namePrefix = "Good Minds";
const description = "Good Minds Breads";
// export let baseUri = "ipfs://baseURI";

const layerConfigurations = [
  {
    growEditionSizeTo: 5,
    // Good minds bread
    layersOrder: [{ name: "background" }, { name: "body" }, { name: "face" }],
  },
];

const format = {
  width: 512,
  height: 512,
  smoothing: false,
};

export { namePrefix, description, layerConfigurations, format };
