import express, { Request, Response as ExpressResponse } from 'express';
import { checkLayersURIInABI, getLayersURI } from '../services/collection';
import { getTokenMetadata } from '../services/nft';
import { supportedCollections } from '../supportedCollections';
import { APIResponse, Collection, TokenData } from '../types';

export const router = express.Router();

interface GetCollectionPathParams {
    contract: string;
}
interface GetQueryParams {
    readonly user?: string;
}

type GetResponse = APIResponse<string>;
type GetCollectionResponse = APIResponse<Collection>;

router.get('/collections/:contract', async (
    req: Request<GetCollectionPathParams, {}, {}, GetQueryParams>,
    res: ExpressResponse<GetCollectionResponse>,
) => {
    const { contract } = req.params;

    if (!contract || !supportedCollections[contract])
        return res.status(404).json({ success: false, data: "Collection not found" });

    let layersURI = '';

    if (!checkLayersURIInABI(contract)) {
        layersURI = supportedCollections[contract].layersURI;
    } else {
        try {
            layersURI = await getLayersURI(contract, 'mainnet');
        } catch (e) {
            layersURI = supportedCollections[contract].layersURI;

        }
    }

    return res.json({ success: true, data: { ...supportedCollections[contract], layersURI } });
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
    try {
        const tokenData = await getTokenMetadata(contract, tokenID, 'mainnet');

        return res.json({ success: true, data: tokenData });
    } catch (error: any) {
        console.log('There was an error in resolving the tokenURI!');
        if (error.response) {
            console.log(error.response.data);
            console.log(error.response.status);
        } else {
            console.error(error.message);
            console.log(error);
        }
        return res.status(404).json({ success: false, data: 'TokenID not found.' });

    }
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