import React, { createContext, useState, useEffect } from 'react';
import { jwtDecode } from 'jwt-decode';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [authState, setAuthState] = useState({ token: null, role: null });

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            try {
                const decoded = jwtDecode(token);
                setAuthState({ token, role: decoded.role });
            } catch (error) {
                console.error('Tokenni dekod qilishda xatolik:', error);
                setAuthState({ token: null, role: null });
            }
        }
    }, []);

    const setAuthInfo = (token) => {
        if (token) {
            try {
                const decoded = jwtDecode(token);
                setAuthState({ token, role: decoded.role });
                localStorage.setItem('token', token);
            } catch (error) {
                console.error('Tokenni dekod qilishda xatolik:', error);
            }
        } else {
            setAuthState({ token: null, role: null });
            localStorage.removeItem('token');
        }
    };

    const logout = () => {
        setAuthState({ token: null, role: null });
        localStorage.removeItem('token');
    };

    return (
        <AuthContext.Provider value={{ authState, setAuthInfo, logout }}>
            {children}
        </AuthContext.Provider>
    );
};
