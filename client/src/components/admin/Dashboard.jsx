import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { TailSpin } from 'react-loader-spinner';
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';

const Dashboard = () => {
  const [subjects, setSubjects] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [selectedSubject, setSelectedSubject] = useState(null);
  const [subjectDetails, setSubjectDetails] = useState(null);
  const [questions, setQuestions] = useState([]);
  const navigate = useNavigate();

  // Tokenni tekshirish va adminId ni saqlash
  useEffect(() => {
    const token = localStorage.getItem('token');

    if (!token) {
      navigate('/'); // Token bo'lmasa login sahifasiga yo'naltirish
      return;
    }

    try {
      const decodedToken = jwtDecode(token);
      const adminId = decodedToken.userId;

      if (!adminId) {
        throw new Error("Invalid Token");
      }

      localStorage.setItem('adminId', adminId);
    } catch (error) {
      console.log('Invalid token:', error);
      navigate('/'); // Token noto'g'ri bo'lsa, login sahifasiga yo'naltirish
    }
  }, [navigate]);

  // Fanlarni olish funksiyasi
  const fetchSubjects = async () => {
    setLoading(true);
    setError('');

    try {
      const token = localStorage.getItem('token');
      const adminId = localStorage.getItem('adminId');

      if (!token || !adminId) {
        navigate('/');
        setError('Token yoki admin ma\'lumotlari topilmadi. Iltimos, qayta login qiling.');
        return;
      }

      const response = await axios.get(`https://sinftest6.onrender.com/api/subjects`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
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

  // Tanlangan fan haqida ma'lumot olish
  const handleSubjectClick = async (subject) => {
    setLoading(true);
    setSelectedSubject(subject);
    setError('');
    setSubjectDetails(null);

    try {
      const token = localStorage.getItem('token');

      const response = await axios.get(`https://sinftest6.onrender.com/api/questions/subject/${subject}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      console.log(response.data);

      setQuestions(response.data || []); // Agar ma'lumot bo'lmasa, bo'sh array qabul qilinadi
      setSubjectDetails(response.data);

      if (!response.data || response.data.length === 0) {
        setError("Savollar topilmadi.");
      }
    } catch (err) {
      setError("Ma'lumotlarni olishda xatolik yuz berdi.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Tanlangan savolni o'chirish funksiyasi
  const handleDelete = async (id) => {
    setLoading(true);

    try {
      const token = localStorage.getItem('token');

      if (!token) {
        throw new Error('Token topilmadi. Iltimos, qayta login qiling.');
      }

      await axios.delete(`https://sinftest6.onrender.com/admin/questions/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const updatedQuestions = questions.filter((question) => question._id !== id);
      setQuestions(updatedQuestions);

      handleSubjectClick(selectedSubject); // Tanlangan fanni yangilash
    } catch (err) {
      setError("O'chirishda xatolik yuz berdi.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Barcha savollarni o'chirish funksiyasi
  const handleDeleteAll = async () => {
    if (!window.confirm('Barcha savollarni o‘chirishni istaysizmi?')) return;

    setLoading(true);

    try {
      const token = localStorage.getItem('token');

      if (!token) {
        throw new Error('Token topilmadi. Iltimos, qayta login qiling.');
      }

      await axios.delete(`https://sinftest6.onrender.com/admin/questions/subject/${selectedSubject}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setQuestions([]);
    } catch (err) {
      setError("Barcha savollarni o'chirishda xatolik yuz berdi.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Savollarni va variantlarini jadval ko'rinishda ko'rsatish
  return (
    <div className="min-h-screen bg-gradient-to-r w-full from-indigo-600 to-purple-600 flex flex-col items-center justify-center p-4 sm:p-6">
      <div className="bg-white shadow-2xl rounded-xl p-4 sm:p-6 md:p-8 w-full max-w-4xl">
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-center mb-6 sm:mb-8 text-gray-800">Admin Dashboard</h1>

        <h2 className="text-xl sm:text-2xl font-semibold text-gray-700 mb-4 sm:mb-6">Fanlar ro'yxati</h2>

        <button
          onClick={fetchSubjects}
          className="mb-4 sm:mb-6 w-full py-2 sm:py-3 px-4 sm:px-6 bg-indigo-600 text-white font-semibold rounded-lg shadow-lg hover:bg-indigo-700 transition duration-300"
        >
          Fanlarni yuklash
        </button>
        <br />
        <button
          onClick={fetchSubjects}
          className="mb-4 sm:mb-6 w-full py-2 sm:py-3 px-4 sm:px-6 bg-green-600 text-white font-semibold rounded-lg shadow-lg hover:bg-indigo-700 transition duration-300"
        >
          Natijalarni yuklash 
        </button>

        {loading && (
          <div className="flex justify-center items-center">
            <TailSpin height="50" width="50" color="blue" ariaLabel="loading" />
          </div>
        )}

        {error && <div className="text-red-600 text-center mb-4 sm:mb-6">{error}</div>}

        {/* Fanlar ro'yxati */}
        <ul className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
          {subjects.length > 0 ? (
            subjects.map((subject) => (
              <li
                key={subject._id}
                onClick={() => handleSubjectClick(subject._id)}
                className="cursor-pointer p-4 border border-gray-300 bg-gray-100 rounded-lg hover:bg-gray-200 transition duration-200 text-gray-800"
              >
                {subject.name}
              </li>
            ))
          ) : (
            <li className="text-gray-500 italic text-center col-span-full">{error || "Fanlar topilmadi."}</li>
          )}
        </ul>

        {/* Savollar va variantlar jadvali */}
        {selectedSubject && questions.length > 0 && (
          <div className="mt-6 sm:mt-8 bg-gray-100 p-4 sm:p-6 rounded-lg shadow-lg">
            <h3 className="text-lg sm:text-xl font-semibold text-gray-700 mb-4">Savollar va variantlar</h3>

            <div className="overflow-x-auto">
              <table className="min-w-full bg-white border text-sm sm:text-base">
                <thead>
                  <tr>
                    <th className="px-4 sm:px-6 py-2 sm:py-3 border-b">Savol</th>
                    <th className="px-4 sm:px-6 py-2 sm:py-3 border-b">Vaqti</th>
                    <th className="px-4 sm:px-6 py-2 sm:py-3 border-b">Variantlar</th>
                    <th className="px-4 sm:px-6 py-2 sm:py-3 border-b">Amallar</th>
                  </tr>
                </thead>
                <tbody>
                  {questions.map((question) => (
                    <tr key={question._id}>
                      <td className="px-4 sm:px-6 py-2 sm:py-4 border-b">{question.questionText}</td>
                      <td className="px-4 sm:px-6 py-2 sm:py-4 border-b">{new Date(question.createdAt).toLocaleString()}</td>
                      <td className="px-4 sm:px-6 py-2 sm:py-4 border-b">
                        <ul className="list-disc pl-5">
                          {question.options.map((option, idx) => (
                            <li
                              key={idx}
                              className={`text-gray-800 ${option.isCorrect ? 'font-bold' : ''}`}
                            >
                              {option.text}
                            </li>
                          ))}
                        </ul>
                      </td>
                      <td className="px-4 sm:px-6 py-2 sm:py-4 border-b">
                        <button
                          onClick={() => handleDelete(question._id)}
                          className="text-red-600 hover:text-red-800 transition duration-200"
                        >
                          O'chirish
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <button
              onClick={handleDeleteAll}
              className="mt-4 w-full py-2 sm:py-3 px-4 sm:px-6 bg-red-600 text-white font-semibold rounded-lg shadow-lg hover:bg-red-700 transition duration-300"
            >
              Barcha savollarni o'chirish
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
