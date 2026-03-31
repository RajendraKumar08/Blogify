import React from 'react';
import Footer from './Footer/Footer';
import Header from './Header/Header';
import { Outlet, useLocation } from 'react-router-dom';
import ChatBot from './ChatBot/ChatBot';

function Layout() {
    const location = useLocation();
    const isBlogPage = location.pathname.startsWith('/Blog');

    return (
        <>
            <div className='flex flex-col justify-between min-h-screen'>
                <Header />
                <Outlet />
                <Footer />
                {isBlogPage && <ChatBot />}
            </div>
        </>
    );
}

export default Layout;