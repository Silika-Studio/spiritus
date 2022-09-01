export type Attribute = {
  trait_type: string;
  value: number | string;
};

export type Element = {
  id: number;
  name: string | undefined;
  filename: string;
  path: string;
  weight: number;
};

export type Metadata = {
  id: number;
  name: string;
  description: string;
  image: string;
  hash?: string;
  date?: number;
  attributes: Attribute[];
};

export type Layer = {
  id: number;
  elements: any;
  name: string;
  blend: string;
  opacity: number;
  bypassDNA: boolean;
  options?: any;
};

export type LayerConfig = {
  name: string;
  options?: any;
};

export type DNALayer = {
  name: string;
  blend: string;
  opacity: number;
  selectedElement: any;
};

interface UploadTraitType {
  id?: number;
  value: string;
  url: string;
}

export type UploadCollectionTraits = {
  rootHash: string;
  collectionName: string;
  traits: Record<string, UploadTraitType[]>;
};

interface LoadTraitType {
  value: string;
  url: string;
  data: Buffer;
}
export type LoadCollectionTraits = {
  layerHash: string;
  collectionName: string;
  traits: Record<string, LoadTraitType[]>;
};
export type IPFSLayer = {
  id: number;
  trait_type: string;
  value: string;
  filename: string;
};

export type IPFSLayerForArtEngine = {
  id: number;
  name: string;
  filename: string;
  path: string;
  weight: number;
};
