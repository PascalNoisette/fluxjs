import type { NextPage } from 'next';
import { useEffect } from 'react';
import Board from '../components/Board';
import useAuthentification from '../services/Authentification';

const Home: NextPage = () => {
    const user = useAuthentification();
    useEffect(() => {
        if (!user.isLogged()) {
            user.redirectLogin();
        }
    }, [user]);

    return (
        <>
            user.isLogged() && (<Board />)
        </>
    );
};

export default Home;
