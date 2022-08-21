import axios from "axios";
import { SERVER_URL } from "../constants";
import { APIResponse, TokenData } from "../types";

export const getTokenMetadata = async (contractAddress: string, tokenID: string): Promise<APIResponse<TokenData>> => {
    const res = (await axios.get(`${SERVER_URL}/collections/${contractAddress}/${tokenID}`)).data;
    return res;
};