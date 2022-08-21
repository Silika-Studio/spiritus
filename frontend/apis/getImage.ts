import axios from "axios";
import { SERVER_URL } from "../constants";
import { APIResponse, Trait } from "../types";

export const getImage = async (traits: Trait[], contractAddress: string) => {

    return (await axios.get<APIResponse<string>>(`${SERVER_URL}/collections/${contractAddress}/generate`, {
        params: { traits: JSON.stringify(traits) }
        // params: { traits: JSON.stringify([{ traitType: 'bg', value: 'warm' }]) }
    })).data;
};