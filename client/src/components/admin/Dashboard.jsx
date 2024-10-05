import React, { useState } from 'react';
import axios from 'axios';

const Dashboard = () => {
  const [subjects, setSubjects] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [selectedSubject, setSelectedSubject] = useState(null); // Tanlangan fanni saqlash

  const fetchSubjects = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');

      if (!token) {
        setError('Token topilmadi. Iltimos, qayta login qiling.');
        return;
      }

      const response = await axios.get('http://localhost:5000/admin/subjects', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setSubjects(response.data.subjects);
    } catch (err) {
      setError('Ma\'lumotlarni olishda xatolik yuz berdi.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubjectClick = async (subject) => {
    setLoading(true);
    setSelectedSubject(subject); // Tanlangan fanni yangilash
    try {
      const token = localStorage.getItem('token');

      const response = await axios.get(`http://localhost:5000/admin/subjects/${subject._id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      // Natijalarni ko'rsatish uchun kerakli ma'lumotlar bilan ishlang
      console.log(response.data); // Bu yerda natijalarni konsolga chiqaramiz
    } catch (err) {
      setError('Ma\'lumotlarni olishda xatolik yuz berdi.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center p-6">
      <div className="bg-white shadow-lg rounded-lg p-8 w-full max-w-2xl">
        <h1 className="text-3xl font-bold text-center mb-6 text-gray-800">Admin Dashboard</h1>
        <h2 className="text-xl font-semibold text-gray-700 mb-4">Biriktirilgan Fanlar</h2>
        
        <button
          onClick={fetchSubjects}
          className="mb-4 w-full py-2 px-4 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 transition duration-300"
        >
          Fanlarni yuklash
        </button>
        
        {loading && <div className="text-center text-gray-600">Yuklanmoqda...</div>}
        {error && <div className="text-red-600 text-center mb-4">{error}</div>}

        <ul className="bg-gray-50 rounded-lg shadow-md p-4">
          {subjects.length > 0 ? (
            subjects.map((subject) => (
              <li
                key={subject._id}
                onClick={() => handleSubjectClick(subject)} // Ustiga bosilganda so'rov yuborish
                className="cursor-pointer p-2 border-b border-gray-300 last:border-b-0 text-gray-800 hover:bg-gray-100 transition duration-200"
              >
                {subject.name}
              </li>
            ))
          ) : (
            <li className="text-gray-500 italic text-center">Fanlar topilmadi.</li>
          )}
        </ul>

        {/* Tanlangan fan haqida qo'shimcha ma'lumotlarni ko'rsatish */}
        {selectedSubject && (
          <div className="mt-6 p-4 border border-gray-300 rounded-lg bg-gray-50">
            <h3 className="text-xl font-semibold text-gray-700">Tanlangan Fan: {selectedSubject.name}</h3>
            {/* Bu yerda savollar va variantlar bo'lishi mumkin */}
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
