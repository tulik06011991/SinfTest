import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom'; // Link import qilish
import { TailSpin } from 'react-loader-spinner'; // Loader uchun import

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false); // Loading holatini qo'shish
    const navigate = useNavigate();
    const [fanId, setFanId] = useState({});
    

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true); // Formani yuborishda loading holatini yoqish
        try {
            const response = await axios.post('http://localhost:5000/api/login', { email, password });
localStorage.setItem('userName', response.data.name)

            if (response.data.token) {
                localStorage.setItem('token', response.data.token);

                if (response.data.subjects && response.data.subjects.length > 0) {
                    const fanId = response.data.subjects[0]._id; // Birinchi elementning _id sini oladi
                    localStorage.setItem('fanId', fanId);
                    setFanId(response.data.subjects);
                }

                if (response.data.redirect === "/superadmin/dashboard") {
                    navigate('/superadmin');
                } else if (response.data.redirect === '/savollarjavoblar') {
                    navigate('/savollarjavoblar');
                } else {
                    navigate('/dashboard');
                }
            } else {
                setError('Email yoki parol noto\'g\'ri');
            }
        } catch (err) {
            setError('Email yoki parol noto\'g\'ri');
        } finally {
            setLoading(false); // API so'rovi tugagach loading holatini o'chirish
        }
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-r from-indigo-500 to-purple-600">
            <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
                <h2 className="text-3xl font-bold text-center text-blue-600 mb-6">Login</h2>
                {error && <p className="text-red-500 mb-4 text-center">{error}</p>}
                {loading && (
                    <div className="flex justify-center mb-4">
                        <TailSpin height="30" width="30" color="blue" ariaLabel="loading" />
                    </div>
                )}
                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label className="block text-gray-700 font-semibold mb-2" htmlFor="email">Email</label>
                        <input
                            type="email"
                            id="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            required
                        />
                    </div>
                    <div className="mb-6">
                        <label className="block text-gray-700 font-semibold mb-2" htmlFor="password">Parol</label>
                        <input
                            type="password"
                            id="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            required
                        />
                    </div>
                    <button
                        type="submit"
                        className={`w-full bg-blue-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200 ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
                        disabled={loading} // Yuklanish holatida tugmani o'chirish
                    >
                        Kirish
                    </button>
                </form>
                <p className="mt-4 text-center">
                    Hisobingiz yo'qmi? <Link to="/register" className="text-blue-600 hover:underline">Ro'yxatdan o'tish</Link>
                </p>
            </div>
        </div>
    );
};

export default Login;
