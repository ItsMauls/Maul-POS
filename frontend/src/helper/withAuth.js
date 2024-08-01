import { useRouter } from "next/router"
import { useEffect } from "react";
import isLoggedIn from "./isLoggedIn";

export function withAuth(Component) {
    return function AuthenticatedComponent(props) {
        const router = useRouter();

        useEffect(() => {
            if (!isLoggedIn()) {
                router.push('/login');
            }
        }, []);

        return <Component {...props} />;
    };
}