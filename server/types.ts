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

export interface Trait {
    trait_type: string;
    value: string;
}
export interface TokenUriResponse {
    name: string;
    image: string;
    id: string;
    image_url: string;
    attributes: Trait[];
}

export interface TokenData {
    assetName: string;
    imageUrl: string;
    id: string;
    attributes: Trait[];
}

export type CollectionWriteStatus = 'writeable' | 'not-writeable';

export interface Collection {
    status: CollectionWriteStatus;
    layersURI: string;
    // layers
}