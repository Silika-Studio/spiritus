export interface UploadTraitType { value: string, url: string; }
export type UploadCollectionTraits = {
    rootHash: string;
    collectionName: string;
    traits: Record<string, UploadTraitType[]>;
};

export type Step = 'connect' | 'input-contract' | 'input-layersURI' | 'edit-metadata';


export interface StepProps {
    setCurrentStep: (step: Step) => void;
}


export interface Collection {
    layersURI: string;
    contractAddress: string;
    isSupported: boolean;
}

export interface NFT {
    tokenID: string;
    image: string;
    attributes: { traitType: string; value: string; }[];
}