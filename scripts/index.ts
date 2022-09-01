import axios from 'axios';
import { ethers } from 'ethers';
// import abi from "./abi.json";
import fs from 'fs';
import https from 'https';
import sharp from 'sharp';
import abiNouns from "./abi2.json";

require('dotenv').config({ path: require('find-config')('.env') });

export interface NounsTokenMetadata {
    name: string;
    description: string;
    image: string;
}

const providerInstance =
    new ethers.providers.JsonRpcProvider(
        // 'http://127.0.0.1:8545'
        'https://eth-mainnet.g.alchemy.com/v2/oe-Mq8Eas6exIkv3n8-1EruJXYDe7dfj'
    );

const walletAddr = '0x70997970c51812dc3a010c7d01b50e0d17dc79c8';
const pk = '0x59c6995e998f97a5a0044966f0945389dc9e86dae88c7a8412f4603b6b78690d';
var wallet = new ethers.Wallet(pk, providerInstance);

const addr = '0x9C8fF314C9Bc7F6e59A9d9225Fb22946427eDC03';
// const addr='0x5FbDB2315678afecb367f032d93F642f64180aa3'

const contract =
    new ethers.Contract(addr, abiNouns, wallet);
const read = async () => {
    console.log("calling");

    const res = await contract.dataURI(0);
    console.log(res);
    const data: NounsTokenMetadata = JSON.parse(
        Buffer.from(res.substring(29), 'base64').toString('ascii'),
    );
    console.log(data);
    // console.log(JSON.parse(atob(res)));
    // console.log(Buffer.from(res, 'base64'));
};

const write = async () => {
    console.log("calling");

    const res = await contract.safeMint(walletAddr);
    console.log(res);
};

interface UploadTraitType { value: string, url: string; }

type UploadCollectionTraits = {
    rootHash: string;
    collectionName: string;
    traits: Record<string, UploadTraitType[]>;
};


export const saveAllLayers = async (collection: string) => {
    const collectionTraits: UploadCollectionTraits = { rootHash: '', collectionName: `${collection}`, traits: {} };
    const relativeLayersFolder = `../layers/${collection}/`;
    let ipfsImageArray: { path: string, content: string; }[] = [];
    var files = fs.readdirSync(__dirname + '/' + relativeLayersFolder);
    for (let i = 0; i < files.length; i++) {
        const currFile = files[i];
        console.log(currFile);
        const img = fs.readFileSync(`layers/${collection}/` + currFile, { encoding: 'base64' });


        ipfsImageArray.push(
            {
                path: currFile,
                content: img,
            },
        );

    }

    try {
        const r = await axios.post<{ path: string; }[]>('https://deep-index.moralis.io/api/v2/ipfs/uploadFolder',
            ipfsImageArray,
            {
                headers: {
                    'X-API-KEY': process.env.MORALIS_API_KEY!,
                    'Content-Type': 'application/json',
                    'accept': 'application/json',
                },
            },
        );
        const aPath = r.data[0].path;
        collectionTraits.rootHash = aPath.substring(aPath.indexOf('/Qm')).split('/')[1];

        r.data.forEach(d => {


            const pathComponents = d.path.replace('.png', '').split('/');
            const fileCleaned = pathComponents[pathComponents.length - 1];
            const traitType = fileCleaned.split('-')[0];
            const traitValue = fileCleaned.replace(traitType + '-', '');

            if (!collectionTraits.traits[traitType]) collectionTraits.traits[traitType] = [];

            collectionTraits.traits[traitType].push({ value: traitValue, url: fileCleaned + '.png' });

        });
        console.log(r.data);

    } catch (e) {
        console.log(e);
    }

    const r = await axios.post<{ path: string; }[]>('https://deep-index.moralis.io/api/v2/ipfs/uploadFolder',
        [{ path: 'layers.json', content: collectionTraits }],
        {
            headers: {
                'X-API-KEY': process.env.MORALIS_API_KEY!,
                'Content-Type': 'application/json',
                'accept': 'application/json',
            },
        },
    );
    console.log(r.data);

    console.log(collectionTraits);
    return collectionTraits;
};

interface LoadTraitType { value: string, url: string; data: Buffer; }
type LoadCollectionTraits = {
    layerHash: string;
    collectionName: string;
    traits: Record<string, LoadTraitType[]>;
};

const ipfsGatewayUrl = 'https://ipfs.moralis.io:2053/ipfs/';

const loadAllLayers = async () => {

    const layers: LoadCollectionTraits = { layerHash: 'QmZ6mcScDMKiYt49fddbMzFwmfmc6os2a7QsbeJ7ocZP2M', collectionName: 'nouns', traits: {} };
    const r = await axios.get<UploadCollectionTraits>(`${ipfsGatewayUrl}${layers.layerHash}/layers.json`);
    const httpsAgent = new https.Agent({ keepAlive: true });
    console.log(r.data);
    const promises: Promise<void>[] = [];
    Object.entries(r.data.traits).forEach(([traitType, traits]) => {
        traits.forEach((trait, i) => {
            const get = async () => {
                await new Promise((resolve) => {
                    setTimeout(resolve, i * 5);
                });
                const buffer = Buffer.from(await sharp((await axios.get(
                    `${ipfsGatewayUrl}${r.data.rootHash}/${trait.url}`,
                    { responseType: 'arraybuffer', httpsAgent },
                )).data)
                    .toBuffer());

                if (!layers.traits[traitType]) layers.traits[traitType] = [];
                layers.traits[traitType].push({ data: buffer, ...trait });
                console.log(`Successfully downloaded ${trait.url}!`);
                await sharp(buffer).toFormat('png').toFile(__dirname + '/../test/nouns/' + trait.url);
            };
            promises.push(get());

        });
    });

    await Promise.all(promises);

    console.log(layers);

};

loadAllLayers();