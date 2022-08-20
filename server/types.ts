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
