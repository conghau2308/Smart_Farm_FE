import axios from "axios"
import { port } from "../utils/env"
import { handleError } from "./handleError";


export const getThresholdByDeviceAndParam = async ( device_id, parameter ) => {
    try {
        const res = await axios.get(`${port}/device_threshold/filter`, {
            params: {
                device_id,
                parameter
            }
        });

        return res.data;
    }
    catch (error) {
        return handleError(error);
    }
}