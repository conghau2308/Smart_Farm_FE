import axios from "axios"
import { port } from "../utils/env"
import { handleError } from "./handleError";


export const loginService = async( username, password ) => {
    try {
        const res = await axios.post(`${port}/user/login`, { username, password });
        const token = res.data.token;
        return token;
    }
    catch (error) {
        return handleError(error);
    }
}

export const registerService = async( username, password, email, phone ) => {
    try {
        const res = await axios.post(`${port}/user/register`, {
            username,
            password,
            email,
            phone
        });

        if (res.data.message === "User registered") {
            return res.data;
        } else {
            return null;
        }
    } catch (error) {
        return handleError(error);
    }
}