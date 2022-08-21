import axios from "axios";
import { ethers } from "ethers";
import { TokenData, TokenUriResponse } from "../types";
import { decodeBase64TokenURI, getABI, getProvider, ipfsLocationToHttpsGateway, Network, NOUNS_CONTRACT_ADDRESS } from "./utils";



export const getTokenMetadata = async (contractAddress: string, tokenID: string, network: Network): Promise<TokenData> => {

    const contract =
        new ethers.Contract(contractAddress, getABI(contractAddress), getProvider(network));

    const tokenURI = await contract.tokenURI(tokenID);
    console.log(tokenURI);
    const { image, name, image_url, attributes } =
        tokenURI.includes("application/json;base64") ?
            decodeBase64TokenURI(tokenURI)
            :
            (await axios.get<TokenUriResponse>(
                ipfsLocationToHttpsGateway(tokenURI),
            )).data;
    console.log(tokenURI);
    console.log(image_url);
    const safeImageUrl = image ?? image_url;
    const httpImageUrl = ipfsLocationToHttpsGateway(safeImageUrl);

    // Interim nouns overrides to have the app work
    // Nouns dont have attributes and the imageURL is an encoded SVG
    const nounsOverrides = contractAddress === NOUNS_CONTRACT_ADDRESS ?
        {
            imageUrl: 'https://openseauserdata.com/files/a307996898e1d8af7022fea791b463ce.svg',
            attributes: [
                { trait_type: "accessory", value: '1n' },
                { trait_type: "bg", value: 'warm' }
            ]
        } as Partial<TokenData> : {};

    return {
        assetName: name ?? tokenID,
        imageUrl: httpImageUrl,
        id: tokenID,
        attributes,
        ...nounsOverrides
    };


};