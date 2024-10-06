import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';


const NavbarSidebar = () => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [isAdmin, setIsAdmin] = useState(false);
    const navigate = useNavigate();

    // Sidebar ochib yopish funksiyasi
    const toggleSidebar = () => {
        setIsSidebarOpen(!isSidebarOpen);
    };

    // Foydalanuvchi adminligini tekshirish
    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            const decoded = jwtDecode(token); // Tokenni dekod qilish
            if (decoded.role === 'admin') {   // Token ichidagi roli admin bo'lsa
                setIsAdmin(true);
            }
        }
    }, []);

    const handleLogout = () => {
        localStorage.removeItem('token'); // Tokenni o'chirish
        navigate('/login'); // Login sahifasiga yo'naltirish
    };

    return (
        <>
            {/* Mobil qurilmalar uchun Sidebar ochuvchi tugma */}
            <button 
                className="block lg:hidden text-white text-2xl p-2 bg-gray-800 rounded fixed top-2 left-2 z-20" 
                onClick={toggleSidebar}
            >
                &#9776; {/* Mobil uchun menyu ikonkasi */}
            </button>

            {/* Sidebar (faqat mobil uchun) */}
            <div className={`fixed top-0 left-0 w-64 h-full bg-gray-800 shadow text-white z-20 transform ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} transition-transform duration-300 lg:hidden`}>
                <button 
                    className="text-4xl p-4" 
                    onClick={toggleSidebar}
                >
                    &times; {/* Sidebar yopish tugmasi */}
                </button>
                <ul className="mt-10 space-y-4 text-xl">
                    {/* Agar admin bo'lsa */}
                    {isAdmin ? (
                        <>
                            <li><Link to="/" onClick={toggleSidebar} className="block p-4 hover:bg-gray-700">Word</Link></li>
                            <li><Link to="/quiz" onClick={toggleSidebar} className="block p-4 hover:bg-gray-700">Admin</Link></li>
                            <li><Link to="/fanlar" onClick={toggleSidebar} className="block p-4 hover:bg-gray-700">Fanlar</Link></li>
                        </>
                    ) : (
                        <li><Link to="/savollarjavoblar" onClick={toggleSidebar} className="block p-4 hover:bg-gray-700">Test</Link></li>
                    )}
                    <li>
                        <button onClick={handleLogout} className="block w-full p-4 hover:bg-gray-700 text-left">
                            Logout
                        </button>
                    </li>
                </ul>
            </div>

            {/* Desktop uchun Navbar */}
            <nav className="hidden lg:block bg-gray-800 text-white p-4">
                <div className="container mx-auto flex justify-between items-center">
                    <Link to="/" className="text-3xl font-bold">MyApp</Link>
                    <ul className="flex space-x-8 text-xl">
                        {/* Agar admin bo'lsa */}
                        {isAdmin ? (
                            <>
                                <li><Link to="/" className="hover:text-gray-400">Word</Link></li>
                                <li><Link to="/quiz" className="hover:text-gray-400">Admin</Link></li>
                                <li><Link to="/fanlar" className="hover:text-gray-400">Fanlar</Link></li>
                            </>
                        ) : (
                            <li><Link to="/savollarjavoblar" className="hover:text-gray-400">Test</Link></li>
                        )}
                        <li>
                            <button onClick={handleLogout} className="hover:text-gray-400">
                                Logout
                            </button>
                        </li>
                    </ul>
                </div>
            </nav>
        </>
    );
};

export default NavbarSidebar;
