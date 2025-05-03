import axios from "axios"
import { port } from "../utils/env"
import { handleError } from "./handleError";


export const getAllDevicesByZoneNameService = async (name) => {
    try {
        const res = await axios.get(`${port}/zone/${name}/devices`);
        return res.data;
    }
    catch (error) {
        return handleError(error);
    }
}

export const createDeviceService = async ( zone_id, name, device_type, status ) => {
    try {
        const res= await axios.post(`${port}/device/create`, {
            zone_id,
            name,
            device_type,
            status
        })
        
        return res.data;
    }
    catch (error) {
        return handleError(error);
    }
}

export const filterDivicesService = async ( filters = {} ) => {
    try {
        const res = await axios.get(`${port}/device`, { params: filters });
        return res.data;
    }
    catch (error) {
        return handleError(error);
    }
}

export const getDeviceByNameService = async ( name ) => {
    try {
        const res = await axios.get(`${port}/device/${name}`);
        return res.data;
    }
    catch (error) {
        return handleError(error);
    }
}

export const updateDeviceByNameService = async ( name, updatedData ) => {
    try {
        const res = await axios.put(`${port}/device/${name}`, updatedData);
        return res.data;
    }
    catch (error) {
        return handleError(error);
    }
}

export const deleteDeviceByNameService = async ( name ) => {
    try {
        const res = await axios.delete(`${port}/device/${name}`);
        return res.data;
    }
    catch (error) {
        return handleError(error);
    }
}