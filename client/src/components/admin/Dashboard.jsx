import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { TailSpin } from 'react-loader-spinner';
import { useNavigate } from 'react-router-dom';
import { FaTrash } from 'react-icons/fa';
import {jwtDecode }from 'jwt-decode'; 

const Dashboard = () => {
  const [subjects, setSubjects] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [selectedSubject, setSelectedSubject] = useState(null);
  const [subjectDetails, setSubjectDetails] = useState(null);
  const [savollar, setSavollar] = useState([]);
  const navigate = useNavigate();

  // Token tekshiruvi va yo'naltirish
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/'); // Token bo'lmasa login sahifasiga yo'naltirish
    } else {
      try {
        const decodedToken = jwtDecode(token);
        const adminId = decodedToken.userId; // Token ichidan adminId olish
        localStorage.setItem('adminId', adminId);
      } catch (error) {
        console.error('Tokenni dekodlashda xatolik:', error);
        navigate('/');
      }
    }
  }, [navigate]);

  // Fanlar ro'yxatini olish
  const fetchSubjects = async () => {
    setLoading(true);
    setError('');
    try {
      const adminId = localStorage.getItem('adminId')
      const token = localStorage.getItem('token');
      if (!token) {
        navigate('/');
        setError('Token topilmadi. Iltimos, qayta login qiling.');
        return;
      }

      const response = await axios.get(`http://localhost:5000/api/subjects/${adminId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setSubjects(response.data.subjects);
      if (response.data.subjects.length === 0) {
        setError("Fanlar topilmadi.");
      }
    } catch (err) {
      setError("Ma'lumotlarni olishda xatolik yuz berdi.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Fanni bosganda fanga oid savollarni olish
  const handleSubjectClick = async (subject) => {
    setLoading(true);
    setSelectedSubject(subject);
    setError('');
    setSubjectDetails(null);

    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(
        `http://localhost:5000/api/subjects/${subject._id}`, // Fan bo'yicha backend so'rovi
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setSavollar(response.data.questionsWithOptions);
      setSubjectDetails(response.data);

      if (response.data.questionsWithOptions.length === 0) {
        setError("Savollar topilmadi.");
      }
    } catch (err) {
      setError("Savollarni olishda xatolik yuz berdi.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Fanga oid savollarni o'chirish
  const handleDeleteSubject = async (subjectId) => {
    const confirmDelete = window.confirm("Bu fanga oid barcha savollarni o'chirmoqchimisiz?");
    if (!confirmDelete) return;

    try {
      const token = localStorage.getItem('token');
      await axios.delete(`http://localhost:5000/api/subjects/${subjectId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      // Fan o'chirilganidan so'ng fanlar ro'yxatini qayta yuklash
      fetchSubjects();
      setSelectedSubject(null);
      setSubjectDetails(null);
      setSavollar([]);
    } catch (err) {
      setError("Fan va savollarni o'chirishda xatolik yuz berdi.");
      console.error(err);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-indigo-600 to-purple-600 flex flex-col items-center justify-center p-6">
      <div className="bg-white shadow-2xl rounded-xl p-6 md:p-8 w-full max-w-7xl">
        <h1 className="text-3xl md:text-4xl font-bold text-center mb-8 text-gray-800">Admin Dashboard</h1>

        <h2 className="text-2xl font-semibold text-gray-700 mb-6">Fanlar ro'yxati</h2>

        <button
          onClick={fetchSubjects}
          className="mb-6 w-full py-3 px-6 bg-indigo-600 text-white font-semibold rounded-lg shadow-lg hover:bg-indigo-700 transition duration-300"
        >
          Fanlarni yuklash
        </button>

        {loading && (
          <div className="flex justify-center items-center">
            <TailSpin height="50" width="50" color="blue" ariaLabel="loading" />
          </div>
        )}

        {error && <div className="text-red-600 text-center mb-6">{error}</div>}

        <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {subjects.length > 0 ? (
            subjects.map((subject) => (
              <li
                key={subject._id}
                className="flex justify-between items-center cursor-pointer p-4 border border-gray-300 bg-gray-100 rounded-lg hover:bg-gray-200 transition duration-200 text-gray-800"
              >
                <span onClick={() => handleSubjectClick(subject)}>{subject.name}</span>
                <button
                  onClick={() => handleDeleteSubject(subject._id)}
                  className="bg-red-500 text-white p-2 rounded-full hover:bg-red-600 transition duration-300"
                >
                  <FaTrash />
                </button>
              </li>
            ))
          ) : (
            <li className="text-gray-500 italic text-center col-span-full">{error || "Fanlar topilmadi."}</li>
          )}
        </ul>

        {selectedSubject && subjectDetails && (
          <div className="mt-8 bg-gray-100 p-4 md:p-6 rounded-lg shadow-lg">
            <h3 className="text-2xl font-semibold text-gray-700 mb-6">Savollar va Foydalanuvchilar</h3>

            <h4 className="text-lg font-bold mt-6">Savollar:</h4>
            <table className="table-auto w-full bg-white shadow-lg rounded-lg">
              <thead className="bg-indigo-600 text-white">
                <tr>
                  <th className="px-2 py-2 md:px-4 md:py-2">Savol</th>
                  <th className="px-2 py-2 md:px-4 md:py-2">Variantlar</th>
                </tr>
              </thead>
              <tbody>
                {savollar && savollar.length > 0 ? (
                  savollar.map((question, index) => (
                    <tr key={index} className="border-b border-gray-300">
                      <td className="px-2 py-2 md:px-4 md:py-2">{question.questionText}</td>
                      <td className="px-2 py-2 md:px-4 md:py-2">
                        <ul>
                          {question.options.map((option) => (
                            <li key={option._id} className={option.isCorrect ? 'text-green-500' : ''}>
                              {option.text}
                            </li>
                          ))}
                        </ul>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="2" className="text-gray-500 italic text-center py-4">
                      Savollar topilmadi.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
