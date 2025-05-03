import axios from "axios"
import { port } from "../utils/env"
import { handleError } from "./handleError";


export const ledControlService = async ( isLightOn ) => {
    try {
        const res = await axios.post(`${port}/led/control`, {
            isLightOn: isLightOn
        });

        return res.data;
    }
    catch (error) {
        return handleError(error);
    }
}