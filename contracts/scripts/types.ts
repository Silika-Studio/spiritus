export interface Attribute {
  trait_type: string;
  value: number | string;
}

export interface Color {
  r: number;
  g: number;
  b: number;
}

export interface Element {
  id: number;
  name: string | undefined;
  filename: string;
  path: string;
  weight: number;
}

export interface Metadata {
  id: number;
  name: string;
  description: string;
  image: string;
  hash?: string;
  date?: number;
  attributes: Attribute[] | Attribute[][];
}

export interface Layer {
  id: number;
  elements: any;
  name: string;
  blend?: string;
  opacity?: number;
  bypassDNA?: boolean;
  options?: any;
}

export interface LayerWithDNA {
  name: string;
  blend: string;
  opacity: number;
  selectedElement: any;
}
