import React, { useState } from 'react';
import axios from 'axios';

const Dashboard = () => {
  const [subjects, setSubjects] = useState([]); // Bo'sh array sifatida boshlang'ich qiymat
  const [questions, setQuestions] = useState([]); // Savollar uchun
  const [users, setUsers] = useState([]); // Foydalanuvchilar uchun
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const fetchData = async () => {
    setLoading(true);
    try {
      // LocalStorage'dan tokenni olish
      const token = localStorage.getItem('token');

      if (!token) {
        setError('Token topilmadi. Iltimos, qayta login qiling.');
        return;
      }

      // Backendga tokenni jo'natish va ma'lumotlarni olish
      const [subjectsResponse, questionsResponse, usersResponse] = await Promise.all([
        axios.get('http://localhost:5000/api/subjects', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }),
        axios.get('http://localhost:5000/api/questions', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }),
        axios.get('http://localhost:5000/api/users', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }),
      ]);

      // Backenddan kelgan ma'lumotlarni saqlash
      setSubjects(subjectsResponse.data.subjects);
      setQuestions(questionsResponse.data.questions);
      setUsers(usersResponse.data.users);
    } catch (err) {
      setError('Ma\'lumotlarni olishda xatolik yuz berdi.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold text-center mb-6">Admin Dashboard</h1>
      <button
        onClick={fetchData}
        className="block w-full mb-4 py-2 bg-blue-600 text-white font-semibold rounded hover:bg-blue-700 transition"
      >
        Ma'lumotlarni yuklash
      </button>
      {loading && <div className="text-center text-gray-600">Yuklanmoqda...</div>}
      {error && <div className="text-red-600 text-center">{error}</div>}

      <div className="my-6">
        <h2 className="text-2xl font-semibold mb-2">Biriktirilgan Fanlar</h2>
        <ul className="bg-white rounded shadow-md p-4">
          {subjects.length > 0 ? (
            subjects.map((subject) => (
              <li key={subject._id} className="p-2 border-b last:border-b-0">
                {subject.name}
              </li>
            ))
          ) : (
            <li className="text-gray-500 italic text-center">Ma'lumot yo'q</li>
          )}
        </ul>
      </div>

      <div className="my-6">
        <h2 className="text-2xl font-semibold mb-2">Savollar</h2>
        <ul className="bg-white rounded shadow-md p-4">
          {questions.length > 0 ? (
            questions.map((question) => (
              <li key={question._id} className="p-2 border-b last:border-b-0">
                {question.text}
              </li>
            ))
          ) : (
            <li className="text-gray-500 italic text-center">Ma'lumot yo'q</li>
          )}
        </ul>
      </div>

      <div className="my-6">
        <h2 className="text-2xl font-semibold mb-2">Foydalanuvchilar</h2>
        <ul className="bg-white rounded shadow-md p-4">
          {users.length > 0 ? (
            users.map((user) => (
              <li key={user._id} className="p-2 border-b last:border-b-0">
                {user.name}
              </li>
            ))
          ) : (
            <li className="text-gray-500 italic text-center">Ma'lumot yo'q</li>
          )}
        </ul>
      </div>
    </div>
  );
};

export default Dashboard;
