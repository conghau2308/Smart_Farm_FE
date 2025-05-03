import axios from "axios"
import { port } from "../utils/env"
import { handleError } from "./handleError";


export const getValueOfListSensorservice = async ( device_ids, data_type, value_min, value_max, from, to ) => {
    try {
        const res = await axios.get(`${port}/sensor-reading`, {
            params: {
                device_ids: device_ids.join(','),
                data_type: data_type,
                value_min: value_min,
                value_max: value_max,
                from: from,
                to: to
            }
        });

        return res.data;
    }
    catch (error) {
        return handleError(error);
    }
}