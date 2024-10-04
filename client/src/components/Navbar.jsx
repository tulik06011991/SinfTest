import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const NavbarSidebar = () => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    // Sidebar ochib yopish funksiyasi
    const toggleSidebar = () => {
        setIsSidebarOpen(!isSidebarOpen);
    };

    return (
        <>
            {/* Mobil qurilmalar uchun Sidebar ochuvchi tugma */}
            <button 
                className="block lg:hidden text-white text-3xl p-2 bg-gray-800 fixed top-4 left-4 z-20" 
                onClick={toggleSidebar}
            >
                &#9776; {/* Mobil uchun menyu ikonkasi */}
            </button>

            {/* Sidebar (faqat mobil uchun) */}
            <div className={`fixed top-0 left-0 w-64 h-full bg-gray-800 text-white z-20 transform ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} transition-transform duration-300 lg:hidden`}>
                <button 
                    className="text-4xl p-4" 
                    onClick={toggleSidebar}
                >
                    &times; {/* Sidebar yopish tugmasi */}
                </button>
                <ul className="mt-10 space-y-4 text-xl">
                    <li><Link to="/" onClick={toggleSidebar} className="block p-4 hover:bg-gray-700">Home</Link></li>
                    <li><Link to="/about" onClick={toggleSidebar} className="block p-4 hover:bg-gray-700">About</Link></li>
                    <li><Link to="/quiz" onClick={toggleSidebar} className="block p-4 hover:bg-gray-700">Admin</Link></li>
                </ul>
            </div>

            {/* Overlay for mobile sidebar */}
            {isSidebarOpen && (
                <div 
                    className="fixed inset-0 bg-black opacity-50 z-10" 
                    onClick={toggleSidebar}
                ></div>
            )}

            {/* Desktop va Medium qurilmalar uchun Navbar */}
            <nav className="hidden lg:block bg-gray-800 text-white p-4">
                <div className="container mx-auto flex justify-between items-center">
                    <Link to="/" className="text-3xl font-bold">MyApp</Link>
                    <ul className="flex space-x-8 text-xl">
                        <li><Link to="/" className="hover:text-gray-400">Home</Link></li>
                        <li><Link to="/about" className="hover:text-gray-400">About</Link></li>
                        <li><Link to="/quiz" className="hover:text-gray-400">Admin</Link></li>
                    </ul>
                </div>
            </nav>
        </>
    );
};

export default NavbarSidebar;
