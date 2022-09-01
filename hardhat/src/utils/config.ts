// General metadata for Ethereum
const namePrefix = "";
const description = "";
// export let baseUri = "ipfs://baseURI";

const layerConfigurations = [
  {
    growEditionSizeTo: 5,

    layersOrder: [{ name: "background" }, { name: "body" }, { name: "face" }],
  },
];

const format = {
  width: 512,
  height: 512,
  smoothing: false,
};

export { namePrefix, description, layerConfigurations, format };
