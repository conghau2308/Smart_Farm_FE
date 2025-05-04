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

export const pumpControlService = async (isPumpOn) => {
    try {
        const res = await axios.post(`${port}/pump/control`, {
            isPumpOn: isPumpOn
        })

        return res.data;
    }
    catch (error) {
        return handleError(error);
    }
}


export const updateModeDeviceService = async ( device_id , mode, status ) => {
    try {
        const res = await axios.put(`${port}/device-control/update/${device_id}`, {
            mode,
            status,
            updated_by: 0
        });

        return res.data;
    }
    catch (error) {
        return handleError(error);
    }
}

export const getModeByDeviceIdService = async ( device_id ) => {
    try {
        const res = await axios.get(`${port}/device-control/filter`, {
            params: {
                device_id: device_id
            }
        })

        return res.data;
    }
    catch (error) {
        return handleError(error);
    }
}