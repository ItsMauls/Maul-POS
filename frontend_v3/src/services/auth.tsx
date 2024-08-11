
import { API_URL } from "@/constants/api";
import { postBase } from "../utils/http";

async function login(data: any) {
    return postBase(API_URL.AUTH.login, data, { usingToken: false });
}

export {
    login
}