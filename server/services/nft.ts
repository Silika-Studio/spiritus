import axios from "axios";
import { ethers } from "ethers";
import { TokenData, TokenUriResponse } from "../types";
import { getABI, getProvider, ipfsLocationToHttpsGateway, Network } from "./utils";



export const getTokenMetadata = async (contractAddress: string, tokenID: string, network: Network): Promise<TokenData> => {

    const contract =
        new ethers.Contract(contractAddress, getABI(contractAddress), getProvider(network));

    try {
        const tokenURI = await contract.tokenURI(tokenID);
        console.log(tokenURI);
        const { image, name, image_url, attributes } =
            (await axios.get<TokenUriResponse>(
                ipfsLocationToHttpsGateway(tokenURI),
            )).data;
        console.log(tokenURI);
        console.log(image_url);
        const safeImageUrl = image ?? image_url;
        const httpImageUrl = ipfsLocationToHttpsGateway(safeImageUrl);

        return {
            assetName: name ?? tokenID,
            imageUrl: httpImageUrl,
            id: tokenID,
            attributes
        };
    } catch (error: any) {
        console.log('There was an error in resolving the tokenURI!');
        if (error.response) {
            console.log(error.response.data);
            console.log(error.response.status);
        } else {
            console.error(error.message);
            console.log(error);
        }
        return { assetName: tokenID, imageUrl: '', id: tokenID, attributes: [] };
    }

};