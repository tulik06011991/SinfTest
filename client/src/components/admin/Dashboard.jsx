import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { TailSpin } from 'react-loader-spinner';
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode'; // To'g'ri import

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
  
      const response = await axios.get(
        `http://localhost:5000/api/subjects`, 
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

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
  
      const response = await axios.get(
        `http://localhost:5000/api/questions/subject/${subject}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
  
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

  // Fanlarni o'chirish funksiyasi
  const handleDelete = async (id) => {
    setLoading(true);

    try {
      const token = localStorage.getItem('token');

      if (!token) {
        throw new Error('Token topilmadi. Iltimos, qayta login qiling.');
      }

      await axios.delete(`http://localhost:5000/admin/subjects/${id}`, {
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

  // Savollarni va variantlarini ko'rsatish
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

        {/* Fanlar ro'yxati */}
        <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
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

        {/* Savollar va variantlar */}
        {selectedSubject && questions.length > 0 && (
          <div className="mt-8 bg-gray-100 p-4 md:p-6 rounded-lg shadow-lg">
            <h3 className="text-xl font-semibold text-gray-700 mb-4">Savollar va variantlar</h3>
            {questions.map((question) => (
              <div key={question._id} className="mb-6">
                <h4 className="font-bold text-lg">{question.text}</h4>
                <ul className="mt-2 ml-4">
                  {question.options.map((option, idx) => (
                    <li
                      key={idx}
                      className={`mt-1 ${
                        option.isCorrect ? 'text-green-600 font-semibold' : 'text-gray-700'
                      }`}
                    >
                      {option.text} {option.isCorrect && <span>(To'g'ri javob)</span>}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
