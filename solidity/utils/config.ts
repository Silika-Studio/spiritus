// General metadata for Ethereum
// export let namePrefix = "My Project";
// export let description = "Project description";
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

export const pixelFormat = {
  ratio: 2 / 128,
};

export const preview = {
  thumbPerRow: 5,
  thumbWidth: 50,
  imageRatio: format.height / format.width,
  imageName: "preview.png",
};

class ArtEngineConfig {
  _namePrefix = "My Project";
  _description = "Project description";
  _baseUri = "ipfs://baseURI";

  constructor(_namePref: string, _desc: string, _baseUri: string) {
    this._namePrefix = _namePref;
    this._description = _desc;
    this._baseUri = _baseUri;
  }

  get namePrefix() {
    return this._namePrefix;
  }

  // set namePrefix(_namePref: string)
}

// export function updateConfig(_namePrefix: string) {
//   namePrefix = _namePrefix;
// }
