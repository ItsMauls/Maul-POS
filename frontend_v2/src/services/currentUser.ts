import { api } from "@/constants/api";
import Cookies from "js-cookie";

export async function GetCurrentUser() {

    try {

        const token = Cookies.get("access_token");

        if (!token) {
            return null;
        }

        const response = await fetch(`${api.auth.currentUser}`, {
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
            },
        });

        if (!response.ok) {
            if (response.status === 401) {
                // do refresh token

                // get current user again

            }

            return null;
        }

        const data = await response.json();
        return data.data;

    } catch (error) {
        console.error("Failed to get current user", error);
        return null;
    }
}