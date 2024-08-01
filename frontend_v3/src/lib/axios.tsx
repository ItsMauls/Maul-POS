import axios from "axios";

import { Config } from "../utils/http/type";
import { getAccessToken } from "./cookies";

export async function request(
    method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH',
    url: string, data: any, config: Config = { showSuccess: true, showError: true, usingToken: true, headers: {},
    onUploadProgress: (): any => { } }): Promise<any> {
        let {
            headers = {},
            onUploadProgress = () : any => {} 
        } = config

        headers = {
            "Content-Type" : 'application/json',
            ...headers
        }

        config = { 
            showSuccess: true,
            showError: true,
            usingToken: true,
            ...config 
        };

        if (config.usingToken && getAccessToken) {
            headers.Authorization = `Bearer ${getAccessToken}`;
        }
        
        const client = axios.create({
            baseURL : url,
            onUploadProgress: (e: any) => onUploadProgress(e)
        })

        try {
            console.log(data);
            
            const response = await client({
                method,
                data,
                headers,
                responseType : 'json'
            })
            return response
        } catch (error) {
            throw error
        }
    }