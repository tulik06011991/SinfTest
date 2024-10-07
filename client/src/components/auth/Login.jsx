import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { TailSpin } from 'react-loader-spinner'; // Loader import qilindi

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false); // Yuklanish holati
    const navigate = useNavigate();
    const [fanId, setFanId] = useState({})

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true); // Yuklanish holatini yoqamiz

        try {
            const response = await axios.post('http://localhost:5000/api/login', { email, password });
            setFanId(response.data.subjects);
            console.log(response);
            
            localStorage.setItem('token', response.data.token);
            const fanId = response.data.subjects[0]._id; // Birinchi elementning _id sini oladi
            localStorage.setItem('fanId', fanId); // Faqat fanId string holatida saqlanadi

            // Agar redirect '/savollarjavoblar' bo'lsa, SavollarJavoblar sahifasiga yo'naltirish
            if (response.data.redirect === '/savollarjavoblar') {
                navigate('/savollarjavoblar');
            } else {
                navigate('/dashboard'); // Aks holda, dashboard sahifasiga yo'naltirish
            }
        } catch (err) {
            setError('Email yoki parol noto\'g\'ri');
        } finally {
            setLoading(false); // Yuklanish holatini o'chiramiz
        }
    };
    console.log(fanId);

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
            <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
                <h2 className="text-2xl font-bold text-center text-blue-600 mb-6">Login</h2>
                {error && <p className="text-red-500 mb-4">{error}</p>}
                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label className="block text-gray-700 font-bold mb-2" htmlFor="email">Email</label>
                        <input
                            type="email"
                            id="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            required
                        />
                    </div>
                    <div className="mb-6">
                        <label className="block text-gray-700 font-bold mb-2" htmlFor="password">Parol</label>
                        <input
                            type="password"
                            id="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            required
                        />
                    </div>
                    <button
                        type="submit"
                        className="w-full bg-blue-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        disabled={loading} // Yuklanayotgan paytda tugmani o'chirib qo'yamiz
                    >
                        {loading ? (
                            <div className="flex justify-center items-center">
                                <TailSpin height="20" width="20" color="white" ariaLabel="loading" />
                                <span className="ml-2">Yuklanmoqda...</span>
                            </div>
                        ) : (
                            'Kirish'
                        )}
                    </button>
                </form>
                <p className="mt-4 text-center">
                    Hisobingiz yo'qmi? <a href="/register" className="text-blue-600 hover:underline">Ro'yxatdan o'tish</a>
                </p>
            </div>
        </div>
    );
};

export default Login;
