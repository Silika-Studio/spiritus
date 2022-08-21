import express, { NextFunction, Request, Response as ExpressResponse } from 'express';
import { collectionsCache } from '../cache';
import { checkLayersURIInABI, getLayersURI } from '../services/collection';
import { getTokenMetadata } from '../services/nft';
import { generateImage, loadAllLayers } from '../services/utils';
import { supportedCollections } from '../supportedCollections';
import { APIResponse, Collection, TokenData, Trait } from '../types';

export const router = express.Router();

const checkCollection = async (req: Request, res: ExpressResponse, next: NextFunction) => {
    const contract = req.params.contract;

    console.log('checking!');
    if (!contract || !supportedCollections[contract]) {
        return res.status(404).json({ success: false, data: "Collection not found" });

    }

    if (!collectionsCache[contract]) {
        collectionsCache[contract] = await loadAllLayers(supportedCollections[contract].layersURI);
    }

    next();
};


router.use('/collections/:contract', checkCollection);


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

interface GetGenerateQueryParams {
    traits: string;
}


router.get('/collections/:contract/generate', async (
    req: Request<GetCollectionPathParams, {}, {}, GetGenerateQueryParams>,
    res: ExpressResponse<APIResponse<string>>,
) => {
    const { contract } = req.params;
    const { traits } = req.query;
    const traitsParsed: Trait[] = JSON.parse(traits);
    console.log(traits);

    if (!collectionsCache[contract])
        return res.status(400).json({ success: false, data: 'Collection still initialising' });

    const url = await generateImage(traitsParsed, collectionsCache[contract]);

    return res.json({ success: true, data: url });
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