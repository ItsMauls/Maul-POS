import { request } from "@/lib/axios";
import { Config } from "./type";

export const postBase = (url: string, data: any, config?: Config) => {
    return request("POST", url, data, config);
}
  
export const putBase = (url: string, data: any, config?: Config) => {
    return request("PUT", url, data, config);
}

export const patchBase = (url: string, data: any, config?: Config) => {
    return request("PATCH", url, data, config);
}

export const deleteBase = (url: string, config?: Config) => {
    return request("DELETE", url, null, config);
}

export const getBase = (url: string, config?: Config) => {
    return request("GET", url, null, config);
}