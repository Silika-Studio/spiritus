import axios from "axios";
import { SERVER_URL } from "../constants";
import { Collection } from "../types";

export const getContract = async (contractAddress: string): Promise<Collection> => {
    // await sleep(2000);

    const { data } = await axios.get(`${SERVER_URL}/collections/${contractAddress}`);
    return {
        contractAddress: "0x69",
        layersURI: "https://ipfs.moralis.io:2053/ipfs/QmZ6mcScDMKiYt49fddbMzFwmfmc6os2a7QsbeJ7ocZP2M/layers.json",
        isWriteable: true
    };
};