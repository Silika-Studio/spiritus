import { ethers } from "ethers";
import { getABI, getProvider, Network } from "./utils";



export const getLayersURI = async (contractAddress: string, network: Network): Promise<string> => {

    const contract =
        new ethers.Contract(contractAddress, getABI(contractAddress), getProvider(network));


    const layersURI: string = await contract.layersURI();
    return layersURI;
};

export const checkLayersURIInABI = (contractAddress: string) => {

    return getABI(contractAddress).functions['layersURI()'];
};