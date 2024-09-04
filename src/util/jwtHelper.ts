import  { jwtDecode, JwtPayload } from 'jwt-decode';

export const isTokenExpired = (token: string): boolean => {
    try {
        const decoded = jwtDecode<JwtPayload>(token);
        const currentTime = Math.floor(Date.now() / 1000);
        return decoded.exp ? decoded.exp < currentTime : false;
    } catch (error) {
        console.error('Failed to decode token:', error);
        return true;
    }
};
