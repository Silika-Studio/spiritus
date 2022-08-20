import { Collection } from "../types";
import { sleep } from "../utils";

export const getContract = async (contractAddress: string): Promise<Collection> => {
    await sleep(2000);
    return {
        contractAddress: "0x69",
        layersURI: "https://ipfs.moralis.io:2053/ipfs/QmZ6mcScDMKiYt49fddbMzFwmfmc6os2a7QsbeJ7ocZP2M/layers.json",
        isSupported: true
    };
};