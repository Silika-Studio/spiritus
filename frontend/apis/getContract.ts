import axios from "axios";
import { SERVER_URL } from "../constants";
import { Collection } from "../types";

export const getContract = async (contractAddress: string): Promise<Collection> => {
    // await sleep(2000);

    const res = (await axios.get<{ success: boolean; data: Collection; }>(`${SERVER_URL}/collections/${contractAddress}`)).data;
    console.log(res);
    return res.data;
};