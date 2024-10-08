import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();
    const [fanId, setFanId] = useState({})

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('http://localhost:5000/api/login', { email, password });
            
            // Agar token kelgan bo'lsa, uni localStorage'ga saqlash
            if (response.data.token) {
                localStorage.setItem('token', response.data.token);
                console.log(response)
    
                // Admin bo'lsa subjects keladi, agar subjects mavjud bo'lsa fanId'ni olishga harakat qilamiz
                if (response.data.subjects && response.data.subjects.length > 0) {
                    const fanId = response.data.subjects[0]._id; // Birinchi elementning _id sini oladi
                    localStorage.setItem('fanId', fanId); // Faqat fanId string holatida saqlanadi
                    setFanId(response.data.subjects);
                }
    
                // Yo'naltirishni to'g'ri amalga oshirish
                if (response.data.redirect === '/savollarjavoblar') {
                    navigate('/savollarjavoblar');
                } else {
                    navigate('/dashboard'); // Admin uchun yoki boshqa hollarda
                }
            } else {
                setError('Email yoki parol noto\'g\'ri'); // Agar token yoki redirect bo'lmasa xato ko'rsatish
            }
        } catch (err) {
            setError('Email yoki parol noto\'g\'ri'); // Errorni ko'rsatish
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
                        className="w-full bg-blue-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500">
                        Kirish
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
