import { api } from "@/constants/api";
import { postBase } from "../utils/http";

async function login(data: any) {
    return postBase(api.auth.login, data, { usingToken: false });
}

export {
    login
}