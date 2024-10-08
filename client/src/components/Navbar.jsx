import React, { useState, useContext, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from './AuthContext';

const NavbarSidebar = () => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const { authState, logout } = useContext(AuthContext); 
    // AuthContext'dan foydalanuvchi ma'lumotlarini olish
    const navigate = useNavigate();

    // useEffect(() => {
    //     const token = localStorage.getItem('token');
    //     if (!token) {
    //       navigate('/login'); // Token topilmasa, login sahifasiga yo'naltirish
    //     }
    //   }, [navigate]);

    const toggleSidebar = () => {
        setIsSidebarOpen(!isSidebarOpen);
    };

    const handleLogout = () => {
        logout();
        localStorage.clear();
        navigate('/');
    };

    // localStorage'dan tokenni olish
    const token = localStorage.getItem('token');

    // Token mavjud bo'lsa Sidebar ni ko'rsatish
    if (!token) return null;

    return (
        <>
            {/* Mobil qurilmalar uchun Sidebar ochuvchi tugma */}
            <button 
                className="block lg:hidden text-white text-2xl p-2 bg-gray-800 rounded fixed top-2 left-2 z-20" 
                onClick={toggleSidebar}
            >
                &#9776;
            </button>

            {/* Sidebar (faqat mobil uchun) */}
            <div className={`fixed top-0 left-0 w-64 h-full bg-gray-800 shadow text-white z-20 transform ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} transition-transform duration-300 lg:hidden`}>
                <button className="text-4xl p-4" onClick={toggleSidebar}>&times;</button>
                <ul className="mt-10 space-y-4 text-xl">
                    {/* Token mavjud bo'lsa */}
                    {authState.token ? (
                        authState.role === 'admin' ? (
                            <>
                                <li><Link to="/faylyuklash" onClick={toggleSidebar} className="block p-4 hover:bg-gray-700">Word</Link></li>
                                {/* <li><Link to="/quiz" onClick={toggleSidebar} className="block p-4 hover:bg-gray-700">Admin</Link></li>
                                <li><Link to="/fanlar" onClick={toggleSidebar} className="block p-4 hover:bg-gray-700">Fanlar</Link></li> */}
                            </>
                        ) : (
                            <li><Link to="/savollarjavoblar" onClick={toggleSidebar} className="block p-4 hover:bg-gray-700">Test</Link></li>
                        )
                    ) : (
                        <li><Link to="/about" onClick={toggleSidebar} className="block p-4 hover:bg-gray-700">About</Link></li>
                    )}
                    <li>
                        <button onClick={handleLogout} className="block w-full p-4 hover:bg-gray-700 text-left">Logout</button>
                    </li>
                </ul>
            </div>

            {/* Desktop uchun Navbar */}
            <nav className="hidden lg:block bg-gray-800 text-white p-4">
                <div className="container mx-auto flex justify-between items-center text-3xl bold">
                    60-maktab
                    <ul className="flex space-x-8 text-xl">
                        {/* Token mavjud bo'lsa */}
                        {authState.token ? (
                            authState.role === 'admin' ? (
                                <>
                                    <li><Link to="/faylyuklash" className="hover:text-gray-400">Word</Link></li>
                                    {/* <li><Link to="/quiz" className="hover:text-gray-400">Admin</Link></li>
                                    <li><Link to="/fanlar" className="hover:text-gray-400">Fanlar</Link></li> */}
                                </>
                            ) : (
                                <li><Link to="/savollarjavoblar" className="hover:text-gray-400">Test</Link></li>
                            )
                        ) : (
                            <li><Link to="/about" className="hover:text-gray-400">About</Link></li>
                        )}
                        <li>
                            <button onClick={handleLogout} className="hover:text-gray-400">Logout</button>
                        </li>
                    </ul>
                </div>
            </nav>
        </>
    );
};

export default NavbarSidebar;
