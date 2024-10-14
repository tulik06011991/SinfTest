import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const NavbarSidebar = () => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const navigate = useNavigate();

    const toggleSidebar = () => {
        setIsSidebarOpen(!isSidebarOpen);
    };

    const handleLogout = () => {
        // Logout qilish lojiqasi
        localStorage.clear();
        navigate('/');
    };

    const token = localStorage.getItem('token');
    const role = localStorage.getItem('role');

    // Token mavjud bo'lmasa, faqat "About" sahifasini ko'rsatadi
    if (!token) return (
        <nav className="bg-gray-800 text-white p-4">
            <div className="container mx-auto flex justify-between items-center text-3xl bold">
                60-maktab
                <ul className="flex space-x-8 text-xl">
                    <li><Link to="/about" className="hover:text-gray-400">About</Link></li>
                </ul>
            </div>
        </nav>
    );

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
                    {role === '/admin/dashboard' ? (
                        <>
                            <li><Link to="/faylyuklash" onClick={toggleSidebar} className="block p-4 hover:bg-gray-700">Word</Link></li>
                            <li><Link to="/about" onClick={toggleSidebar} className="block p-4 hover:bg-gray-700">About</Link></li>
                        </>
                    ) : role === '/savoljavoblar' ? (
                        <>
                            <li><Link to="/savollarjavoblar" onClick={toggleSidebar} className="block p-4 hover:bg-gray-700">Test</Link></li>
                            <li><Link to="/about" onClick={toggleSidebar} className="block p-4 hover:bg-gray-700">About</Link></li>
                        </>
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
                        {role === '/admin/dashboard' ? (
                            <>
                                <li><Link to="/faylyuklash" className="hover:text-gray-400">Word</Link></li>
                                <li><Link to="/about" className="hover:text-gray-400">About</Link></li>
                            </>
                        ) : role === '/savollarjavoblar' ? (
                            <>
                                <li><Link to="/savollarjavoblar" className="hover:text-gray-400">Test</Link></li>
                                <li><Link to="/about" className="hover:text-gray-400">About</Link></li>
                            </>
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
