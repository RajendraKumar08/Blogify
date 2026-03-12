import React from 'react';
import Footer from './Footer/Footer';
import Header from './Header/Header';
import { Outlet } from 'react-router-dom';

function Layout() {
    return (
        <>
            <div className='flex flex-col justify-between min-h-screen'>
                <Header />
                <Outlet />
                <Footer />
            </div>
        </>
    );
}

export default Layout;