import { ethers } from "ethers";
import { Interface } from "ethers/lib/utils";
import fs from 'fs';
import retry = require('async-retry');


export const NOUNS_CONTRACT_ADDRESS = '0x9C8fF314C9Bc7F6e59A9d9225Fb22946427eDC03';
export const OPENSEA_IPFS_GATEWAY = 'https://opensea.mypinata.cloud';
export type Network = 'mainnet' | 'polygon-mumbai';

export const ipfsLocationToHttpsGateway = (ipfsLoc: string) =>
    ipfsLoc.includes('ipfs://') ?
        `${OPENSEA_IPFS_GATEWAY}/${ipfsLoc
            .replace('ipfs://', 'ipfs/')}` :
        ipfsLoc;

const providerInstanceMainnet = new ethers.providers.AlchemyProvider('mainnet', process.env.ALCHEMY_API_KEY);
const providerInstancePolygonMumbai = new ethers.providers.AlchemyProvider('maticmum', process.env.ALCHEMY_API_KEY);

export const getProvider = (network: Network) => {
    switch (network) {
        case 'mainnet':
            return providerInstanceMainnet;
        case 'polygon-mumbai':
            return providerInstancePolygonMumbai;
    }
};


export const getABI = (contractAddress: string) => {
    return new Interface(fs.readFileSync(`./abis/${contractAddress}.json`, { encoding: 'utf-8' }));
    // return JSON.stringify();
};

const jsonEncodedPrepend = 'application/json;base64,';

export const decodeBase64TokenURI = (tokenURI: string) => {
    return JSON.parse(
        Buffer.from(tokenURI.substring(tokenURI.indexOf('application/json;base64,') + jsonEncodedPrepend.length), 'base64').toString('ascii'),
    );
};


import axios from 'axios';
// import abi from "./abi.json";

import https from 'https';
import sharp from 'sharp';
import { LayerMap, LoadTraitType, Trait, UploadCollectionTraits } from "../types";




const ipfsGatewayUrl = 'https://ipfs.moralis.io:2053/ipfs/';

export const loadAllLayers = async (layersURI: string) => {

    // const layers: LoadCollectionTraits = {
    //     // layerHash: 'QmZ6mcScDMKiYt49fddbMzFwmfmc6os2a7QsbeJ7ocZP2M'
    //     layerHash: 'QmaJejnUuxHgT7dyUTKusDGnTfgnwBnQBRk4nReUrNAT4U'
    //     , collectionName: 'nouns', traits: {}
    // };

    const layers: Record<string, Record<string, LoadTraitType>> = {};
    const r = await axios.get<UploadCollectionTraits>(layersURI);
    const httpsAgent = new https.Agent({ keepAlive: true });
    const promises: Promise<void>[] = [];
    Object.entries(r.data.traits).forEach(([traitType, traits]) => {
        traits.forEach((trait, i) => {
            const get = async () => {
                await new Promise((resolve) => {
                    setTimeout(resolve, i * 40);
                });
                const buffer = Buffer.from(await sharp(
                    (await retry(
                        async (bail) => {
                            const res = await axios.get(
                                `${ipfsGatewayUrl}${r.data.rootHash}/${trait.url}`,
                                { responseType: 'arraybuffer', httpsAgent },
                            );
                            if (res == null) {
                                throw new Error('not found, try again');
                            }

                            return res;
                        },
                        {
                            retries: 5,
                        }
                    )
                    ).data)
                    .toBuffer());

                if (!layers[traitType]) layers[traitType] = {};
                layers[traitType][trait.value] = { data: buffer, ...trait };
            };
            promises.push(get());

        });
    });

    await Promise.all(promises);

    console.log(`Successfully downloaded ${Object.keys(layers).length} trait types!`);

    console.log(layers);
    return layers;
};


export const generateImage = async (traits: Trait[], layerMap: LayerMap) => {
    const now = Date.now();
    await sharp(layerMap[traits[0].traitType][traits[0].value].data)
        .composite(
            traits.slice(1).map(t => (
                { input: layerMap[t.traitType][t.value].data }
            ))
        ).toFile(`./bin/${now}.png`);

    const img = fs.readFileSync(`./bin/${now}.png`, { encoding: 'base64' });


    const r = await axios.post("https://deep-index.moralis.io/api/v2/ipfs/uploadFolder",
        [{ path: 'img.png', content: img }],
        {
            headers: {
                "X-API-KEY": process.env.MORALIS_API_KEY!,
                "Content-Type": "application/json",
                "accept": "application/json"
            }
        }
    );

    console.log(r.data[0].path);

    return (r.data[0].path);

};
