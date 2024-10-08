import React, { useEffect, useState } from 'react';
import axios from 'axios';

const SuperAdmin = () => {
    const [users, setUsers] = useState([]);
    const [questions, setQuestions] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Foydalanuvchilarni va savollarni olish
        const fetchData = async () => {
            try {
                const usersResponse = await axios.get('/api/superadmin/users');
                const questionsResponse = await axios.get('/api/superadmin/questions');
                setUsers(usersResponse.data);
                setQuestions(questionsResponse.data);
                setLoading(false);
            } catch (error) {
                console.error('Ma\'lumotlarni olishda xato yuz berdi:', error);
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    // Foydalanuvchini o'chirish
    const deleteUser = async (userId) => {
        try {
            await axios.delete(`/api/superadmin/users/${userId}`);
            setUsers(users.filter(user => user._id !== userId));
            alert('Foydalanuvchi o\'chirildi!');
        } catch (error) {
            console.error('Foydalanuvchini o\'chirishda xato yuz berdi:', error);
        }
    };

    // Savolni o'chirish
    const deleteQuestion = async (questionId) => {
        try {
            await axios.delete(`/api/superadmin/questions/${questionId}`);
            setQuestions(questions.filter(question => question._id !== questionId));
            alert('Savol o\'chirildi!');
        } catch (error) {
            console.error('Savolni o\'chirishda xato yuz berdi:', error);
        }
    };

    if (loading) {
        return <div>Yuklanmoqda...</div>;
    }

    return (
        <div className="superadmin-container">
            <h1>Super Admin Panel</h1>

            {/* Foydalanuvchilar bo'limi */}
            <div className="section">
                <h2>Foydalanuvchilarni boshqarish</h2>
                {users.length === 0 ? (
                    <p>Foydalanuvchilar topilmadi.</p>
                ) : (
                    <ul>
                        {users.map(user => (
                            <li key={user._id}>
                                {user.email}
                                <button onClick={() => deleteUser(user._id)} className="delete-button">
                                    O'chirish
                                </button>
                            </li>
                        ))}
                    </ul>
                )}
            </div>

            {/* Savollar bo'limi */}
            <div className="section">
                <h2>Savollarni boshqarish</h2>
                {questions.length === 0 ? (
                    <p>Savollar topilmadi.</p>
                ) : (
                    <ul>
                        {questions.map(question => (
                            <li key={question._id}>
                                {question.text}
                                <button onClick={() => deleteQuestion(question._id)} className="delete-button">
                                    O'chirish
                                </button>
                            </li>
                        ))}
                    </ul>
                )}
            </div>
        </div>
    );
};

export default SuperAdmin;
