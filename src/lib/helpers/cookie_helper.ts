import Cookies from "js-cookie";

export const removeAuthToken = () => {
    const isProduction = process.env.NODE_ENV === 'production';
    Cookies.remove('_token', {
        domain: isProduction ? '.fittestwarrior.com' : undefined,
        path: '/',
    });
};

export const setAuthToken = (token: string) => {
    const isProduction = process.env.NODE_ENV === 'production';
    Cookies.set('_token', token, {
        domain: isProduction ? '.fittestwarrior.com' : undefined,
        path: '/',
        secure: isProduction,
        sameSite: 'Lax',
        expires: 7
    });
};
