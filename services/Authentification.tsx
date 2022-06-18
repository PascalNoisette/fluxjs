import { useRouter } from 'next/router';
import { useState } from "react";
export default function useAuthentification() {
    const router = useRouter();
    const [user] = useState({
        isLogged: (): boolean => {
            if (typeof window !== 'undefined') {
                return localStorage.getItem('miniflux_server') != null && localStorage.getItem('miniflux_api_key') != null;
            }
            return false;
        },
        redirectLogin: ():void => {
            router.push('/login');
        },
        login: (username: string|null, password: string|null): void => {
            if (typeof window !== 'undefined' && username != null && password != null) {
                localStorage.setItem('miniflux_server', username);
                localStorage.setItem('miniflux_api_key', password);
                router.push('/');
            }
        },
        logout: (): void => {
            if (typeof window !== 'undefined') {
                localStorage.removeItem('miniflux_server');
                localStorage.removeItem('miniflux_api_key');
                router.reload();
            }
        },
        getEmail: (): string => {
            if (typeof window !== 'undefined') {
                return localStorage.getItem('miniflux_server') || "";
            }
            return "";
        }
    });
    return user;
}