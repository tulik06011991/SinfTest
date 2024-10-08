import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { TailSpin } from 'react-loader-spinner';
import { useNavigate } from 'react-router-dom'; // Router uchun
import { FaTrash } from 'react-icons/fa'; // Ikonlar uchun

const Dashboard = () => {
  const [subjects, setSubjects] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [selectedSubject, setSelectedSubject] = useState(null);
  const [subjectDetails, setSubjectDetails] = useState(null);
  const navigate = useNavigate();

  // Token tekshiruvi va yo'naltirish
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login'); // Token bo'lmasa login sahifasiga yo'naltirish
    }
  }, [navigate]);

  // Fanlar ro'yxatini olish
  const fetchSubjects = async () => {
    setLoading(true);
    setError('');

    try {
      const token = localStorage.getItem('token');
      const fanId = localStorage.getItem('fanId');

      if (!token) {
        navigate('/');
        setError('Token topilmadi. Iltimos, qayta login qiling.');
        return;
      }

      const response = await axios.post(`http://localhost:5000/api/subjects`, { fanId }, {
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

  // Savol yoki foydalanuvchini o'chirish
  const handleDelete = async (type, id) => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`http://localhost:5000/admin/${type}/${id}`,  {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      // O'chirilgandan keyin ma'lumotlarni yangilash
      if (type === 'question') {
        fetchSubjects(); // Savollarni qayta yuklash
      } else {
        fetchUsers(); // Foydalanuvchilarni qayta yuklash
      }
    } catch (err) {
      setError('O\'chirishda xatolik yuz berdi.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Tanlangan fan bo'yicha savollarni olish
  const handleSubjectClick = async (subject) => {
    setLoading(true);
    setSelectedSubject(subject);
    setError('');
    setSubjectDetails(null);

    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`http://localhost:5000/admin/subjects/${subject._id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setSubjectDetails(response.data);
    } catch (err) {
      setError('Ma\'lumotlarni olishda xatolik yuz berdi.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-indigo-600 to-purple-600 flex flex-col items-center justify-center p-6">
      <div className="bg-white shadow-2xl rounded-xl p-6 md:p-8 w-full max-w-7xl">
        <h1 className="text-4xl font-bold text-center mb-8 text-gray-800">Admin Dashboard</h1>

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

        {/* Fanlar ro'yxati */}
        <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {subjects.length > 0 ? (
            subjects.map((subject) => (
              <li
                key={subject._id}
                onClick={() => handleSubjectClick(subject)}
                className="cursor-pointer p-4 border border-gray-300 bg-gray-100 rounded-lg hover:bg-gray-200 transition duration-200 text-gray-800"
              >
                {subject.name}
              </li>
            ))
          ) : (
            <li className="text-gray-500 italic text-center col-span-full">Fanlar topilmadi.</li>
          )}
        </ul>

        {selectedSubject && subjectDetails && (
          <div className="mt-8 bg-gray-100 p-6 rounded-lg shadow-lg">
            <h3 className="text-2xl font-semibold text-gray-700 mb-6">Savollar va Foydalanuvchilar</h3>

            {/* Savollar jadvali */}
            <h4 className="text-lg font-bold mt-6">Savollar:</h4>
            <table className="table-auto w-full bg-white shadow-lg rounded-lg">
              <thead className="bg-indigo-600 text-white">
                <tr>
                  <th className="px-4 py-2">Savol</th>
                  <th className="px-4 py-2">Variantlar</th>
                  <th className="px-4 py-2">Amallar</th>
                </tr>
              </thead>
              <tbody>
                {subjectDetails.questions && subjectDetails.questions.length > 0 ? (
                  subjectDetails.questions.map((question) => (
                    <tr key={question._id} className="border-b border-gray-300">
                      <td className="px-4 py-2">{question.question}</td>
                      <td className="px-4 py-2">
                        <ul>
                          {question.options.map((option) => (
                            <li key={option._id} className={option.isCorrect ? 'text-green-500' : ''}>
                              {option.text}
                            </li>
                          ))}
                        </ul>
                      </td>
                      <td className="px-4 py-2 text-center">
                        <button
                          onClick={() => handleDelete('question', question._id)}
                          className="text-red-600 hover:text-red-800"
                        >
                          <FaTrash />
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="3" className="text-gray-500 italic text-center py-4">Savollar topilmadi.</td>
                  </tr>
                )}
              </tbody>
            </table>

            {/* Foydalanuvchilar jadvali */}
            <h4 className="text-lg font-bold mt-6">Foydalanuvchilar:</h4>
            <table className="table-auto w-full bg-white shadow-lg rounded-lg">
              <thead className="bg-indigo-600 text-white">
                <tr>
                  <th className="px-4 py-2">Foydalanuvchi</th>
                  <th className="px-4 py-2">Natija</th>
                  <th className="px-4 py-2">Amallar</th>
                </tr>
              </thead>
              <tbody>
                {subjectDetails.userResults && subjectDetails.userResults.length > 0 ? (
                  subjectDetails.userResults.map((result) => (
                    <tr key={result.user} className="border-b border-gray-300">
                      <td className="px-4 py-2">{result.user}</td>
                      <td className="px-4 py-2">{result.correctAnswersCount}/{result.totalQuestions} to'g'ri</td>
                      <td className="px-4 py-2 text-center">
                        <button
                          onClick={() => handleDelete('user', result.user)}
                          className="text-red-600 hover:text-red-800"
                        >
                          <FaTrash />
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="3" className="text-gray-500 italic text-center py-4">Foydalanuvchilar topilmadi.</td>
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
