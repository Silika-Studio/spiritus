import { NFT } from "../types";
import { sleep } from "../utils";

export const getTokenMetadata = async (contractAddress: string, tokenID: string): Promise<NFT> => {
    await sleep(2000);
    return {
        tokenID,
        // image: 'https://openseauserdata.com/files/b380e6380de1ac397334046e38f9a9c4.svg',
        image: 'https://openseauserdata.com/files/a307996898e1d8af7022fea791b463ce.svg',
        attributes: [
            { traitType: "accessory", value: '1n' },
            { traitType: "bg", value: 'warm' }
        ]
    };
};