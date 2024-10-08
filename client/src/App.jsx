import React from 'react';
import { BrowserRouter as Router, Routes, Route,  Navigate } from 'react-router-dom';
import Home from './components/FaylYuklash'; // Bosh sahifa
import SavollarJavoblar from './components/SavollarJavoblar';
import Admin from './components/admin/Admin'; // About sahifasi
import NavbarSidebar from './components/Navbar';
import CreateSubject  from './components/admin/Fanlar'
import Register from './components/auth/Register';
import Login from './components/auth/Login';
import Dashboard from './components/admin/Dashboard';
import { AuthProvider } from './components/AuthContext';
import About from './components/About';
import SuperAdmin from './components/admin/SuperAdmin';




// import Quiz from './components/Quiz'; // Quiz sahifasi

const App = () => {
    return (
        

        <AuthProvider>
           
        <Router>
         
                <>
                

                {/* Sahifalar uchun Router */}
                <NavbarSidebar/>
                <Routes>
                    <Route path="/faylyuklash" element={<Home />} /> {/* Bosh sahifa */}
                    <Route path="/savollarjavoblar" element={<SavollarJavoblar />} /> {/* About sahifasi */}
                    <Route path="/quiz" element={<Admin />} /> Quiz sahifasi
                    <Route path="/fanlar" element={<CreateSubject />} />
                    <Route path="/" element={<Login />} />
                    <Route path="/register" element={<Register />} />
                    <Route path="/dashboard" element={<Dashboard/>} />
                    <Route path="/about" element={<About/>} />
                    <Route path="/superadmin" element={<SuperAdmin/>} />

                    <Route path="*" element={<Navigate to="/" />} />
                     
                </Routes>
            </>
        </Router>
        </AuthProvider>
        
    );
};

export default App;
