import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Home from './components/FaylYuklash'; // Bosh sahifa
import SavollarJavoblar from './components/SavollarJavoblar';
import Admin from './components/admin/Admin'; // About sahifasi
// import Quiz from './components/Quiz'; // Quiz sahifasi

const App = () => {
    return (
        <Router>
            <div className="app-container">
                {/* Navbar sahifalararo o'tishni amalga oshirish uchun */}
                <nav>
                    <ul>
                        <li>
                            <Link to="/">Home</Link> {/* Bosh sahifaga link */}
                        </li>
                        <li>
                            <Link to="/about">About</Link> {/* About sahifaga link */}
                        </li>
                        <li>
                            <Link to="/quiz">QAdmin</Link> {/* Quiz sahifaga link */}
                        </li>
                    </ul>
                </nav>

                {/* Sahifalar uchun Router */}
                <Routes>
                    <Route path="/" element={<Home />} /> {/* Bosh sahifa */}
                    <Route path="/about" element={<SavollarJavoblar />} /> {/* About sahifasi */}
                    <Route path="/quiz" element={<Admin />} /> Quiz sahifasi
                </Routes>
            </div>
        </Router>
    );
};

export default App;
