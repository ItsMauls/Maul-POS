import jwt from 'jsonwebtoken';

export default function isLoggedIn() {
    const token = localStorage.getItem('refresh_token');

    if (!token) {
        return false;
    }

    try {
        const decodeToken = jwt.decode(token);

        if (!decodeToken.exp) {
            return false;
        }

        console.log(new Date(decodeToken.exp * 1000));

        const expirationDate = new Date(decodeToken.exp * 1000);
        if (expirationDate < new Date()) {
            return false;
        }

        return true;
    } catch (error) {
        return false;
    }
}