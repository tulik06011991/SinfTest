import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Home from './components/FaylYuklash'; // Bosh sahifa
import SavollarJavoblar from './components/SavollarJavoblar';
import Admin from './components/admin/Admin'; // About sahifasi
import NavbarSidebar from './components/Navbar';
import CreateSubject  from './components/admin/Fanlar'
// import Quiz from './components/Quiz'; // Quiz sahifasi

const App = () => {
    return (
        <Router>
         
                <>

                {/* Sahifalar uchun Router */}
                <NavbarSidebar/>
                <Routes>
                    <Route path="/" element={<Home />} /> {/* Bosh sahifa */}
                    <Route path="/about" element={<SavollarJavoblar />} /> {/* About sahifasi */}
                    <Route path="/quiz" element={<Admin />} /> Quiz sahifasi
                    <Route path="/fanlar" element={<CreateSubject />} /> Quiz sahifasi
                </Routes>
            </>
        </Router>
    );
};

export default App;
