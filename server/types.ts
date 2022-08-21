interface SuccessResponse<T> {
    readonly success: true;
    readonly data: T;
}
interface FailureResponse {
    readonly success: false;
    readonly data: string;
}
/**
 * Success or failure API response
 */
export declare type APIResponse<T> = SuccessResponse<T> | FailureResponse;
export { };

export interface TraitFromURI {
    trait_type: string;
    value: string;
}
export interface TokenUriResponse {
    name: string;
    image: string;
    id: string;
    image_url: string;
    attributes: TraitFromURI[];
}

export interface TokenDataFromURI {
    assetName: string;
    imageUrl: string;
    id: string;
    attributes: TraitFromURI[];
}

export type CollectionWriteStatus = 'writeable' | 'not-writeable';

export interface Collection {
    address: string;
    status: CollectionWriteStatus;
    layersURI: string;
    // layers
}

export interface UploadTraitType { value: string, url: string; }

export type UploadCollectionTraits = {
    rootHash: string;
    collectionName: string;
    traits: Record<string, UploadTraitType[]>;
};

export interface LoadTraitType { value: string, url: string; data: Buffer; }
export type LoadCollectionTraits = {
    layerHash: string;
    collectionName: string;
    traits: Record<string, LoadTraitType[]>;
};

export type LayerMap = Record<string, Record<string, LoadTraitType>>;

export interface Trait {
    traitType: string;
    value: string;
}

export interface TokenData {
    assetName: string;
    imageUrl: string;
    id: string;
    attributes: Trait[];
}
