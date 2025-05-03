import axios from "axios"
import { port } from "../utils/env"
import { handleError } from "./handleError";


export const createZoneService = async (name, description) => {
    try {
        const res = await axios.post(`${port}/zone/create`, { name, description });
        return res.data;
    }
    catch (error) {
        return handleError(error);
    }
}

export const getAllZonesService = async () => {
    try {
        const res = await axios.get(`${port}/zone`);
        return res.data;
    }
    catch (error) {
        return handleError(error);
    }
}

export const getZoneByNameService = async (name) => {
    try {
        const res = await axios.get(`${port}/zone/${name}`);
        return res.data;
    }
    catch (error) {
        return handleError(error);
    }
}

export const updateZoneByNameService = async (name, newDescription) => {
    try {
        const res = await axios.put(`${port}/zone/${name}`, newDescription);
        return res.data;
    }
    catch (error) {
        return handleError(error);
    }
}


export const deleteZoneByNameService = async (name) => {
    try {
        const res = await axios.delete(`${port}/zone/${name}`);
        return res.data;
    }
    catch (error) {
        return handleError(error);
    }
}