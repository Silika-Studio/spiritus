import { ethers } from "ethers";
import { Interface } from "ethers/lib/utils";
import fs from 'fs';

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