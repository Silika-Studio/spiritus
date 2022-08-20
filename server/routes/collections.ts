import express, { Request, Response as ExpressResponse } from 'express';
import { getTokenMetadata } from '../services/nft';
import { APIResponse, TokenData } from '../types';

export const router = express.Router();

interface GetCollectionPathParams {
    contract: string;
}
interface GetQueryParams {
    readonly user?: string;
}

type GetResponse = APIResponse<string>;

router.get('/collections/:contract', async (
    req: Request<GetCollectionPathParams, {}, {}, GetQueryParams>,
    res: ExpressResponse<GetResponse>,
) => {
    const { contract } = req.params;

    return res.json({ success: true, data: 'success for ' + contract });
});


router.get('/collections/:contract/generate', async (
    req: Request<GetCollectionPathParams, {}, {}, GetQueryParams>,
    res: ExpressResponse<GetResponse>,
) => {
    const { contract } = req.params;

    return res.json({ success: true, data: 'success for ' + contract });
});


interface GetTokenMetadataPathParams {
    contract: string;
    tokenID: string;
}
type GetTokenMetadataResponse = APIResponse<TokenData>;

router.get('/collections/:contract/:tokenID', async (
    req: Request<GetTokenMetadataPathParams, {}, {}, {}>,
    res: ExpressResponse<GetTokenMetadataResponse>,
) => {
    const { contract, tokenID } = req.params;

    const tokenData = await getTokenMetadata(contract, tokenID, 'mainnet');

    return res.json({ success: true, data: tokenData });
});

router.post('/collections/:contract/:tokenID', async (
    req: Request<GetCollectionPathParams, {}, {}, GetQueryParams>,
    res: ExpressResponse<GetResponse>,
) => {
    const { contract } = req.params;



    // Generate new image
    // Save CID and new traits

    // if writeable and `write` is true, write the data to the contract

    // return new CID and traits

    return res.json({ success: true, data: 'success for ' + contract });
});