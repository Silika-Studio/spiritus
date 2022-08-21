export interface UploadTraitType { value: string, url: string; }
export type UploadCollectionTraits = {
    rootHash: string;
    collectionName: string;
    traits: Record<string, UploadTraitType[]>;
};

export type Step = 'connect' | 'sign' | 'input-contract' | 'input-layersURI' | 'edit-metadata';


export interface StepProps {
    setCurrentStep: (step: Step) => void;
}


export type CollectionWriteStatus = 'writeable' | 'not-writeable';

export interface Collection {
    address: string;
    status: CollectionWriteStatus;
    layersURI: string;
    // layers
}

export interface TokenData {
    tokenID: string;
    imageUrl: string;
    attributes: { traitType: string; value: string; }[];
}

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

export interface Trait {
    traitType: string;
    value: string;
}