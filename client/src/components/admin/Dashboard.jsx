import React, { useState } from 'react';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode' // jwt-decode ni import qilamiz
import { TailSpin } from 'react-loader-spinner'; // Loader import qilindi

const Dashboard = () => {
  const [subjects, setSubjects] = useState([]); // Fanlar ro'yxati
  const [loading, setLoading] = useState(false); // Yuklanish holati
  const [error, setError] = useState(''); // Xato xabarlari
  const [selectedSubject, setSelectedSubject] = useState(null); // Tanlangan fanni saqlash
  const [subjectDetails, setSubjectDetails] = useState(null); // Fan haqida ma'lumotlar (savollar, natijalar va hokazo)

  // Fanlar ro'yxatini olish
  const fetchSubjects = async () => {
    setLoading(true);
    setError('');
    try {
      const token = localStorage.getItem('token');

      if (!token) {
        setError('Token topilmadi. Iltimos, qayta login qiling.');
        return;
      }
      console.log(token);
      

      const fanId = localStorage.getItem('fanId') 
      console.log(fanId)// fanId token ichida saqlangan bo'lishi kerak

      const response = await axios.get(`http://localhost:5000/admin/subjects/${fanId}`,  {
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

  // Tanlangan fan bo'yicha savollar, foydalanuvchilar va natijalarni olish
  const handleSubjectClick = async (subject) => {
    setLoading(true);
    setSelectedSubject(subject); // Tanlangan fanni yangilash
    setError('');
    setSubjectDetails(null); // Ma'lumotlarni tozalash

    try {
      const token = localStorage.getItem('token');

      const response = await axios.get(`http://localhost:5000/admin/subjects/${subject._id}/details`, {
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
        
        {loading && (
          <div className="flex justify-center items-center">
            <TailSpin
              height="50"
              width="50"
              color="blue"
              ariaLabel="loading"
            />
          </div>
        )}

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

            {subjectDetails ? (
              <div>
                <h4 className="text-lg font-semibold mt-4">Savollar:</h4>
                <ul className="list-disc pl-6">
                  {subjectDetails.questions && subjectDetails.questions.length > 0 ? (
                    subjectDetails.questions.map((question) => (
                      <li key={question._id}>
                        <strong>{question.question}</strong>
                        <ul className="list-circle pl-4">
                          {question.options.map((option) => (
                            <li key={option._id}>
                              {option.text} {option.isCorrect ? '(To\'g\'ri)' : ''}
                            </li>
                          ))}
                        </ul>
                      </li>
                    ))
                  ) : (
                    <li className="text-gray-500 italic">Savollar topilmadi.</li>
                  )}
                </ul>

                <h4 className="text-lg font-semibold mt-4">Foydalanuvchilar Natijalari:</h4>
                <ul className="list-disc pl-6">
                  {subjectDetails.userResults && subjectDetails.userResults.length > 0 ? (
                    subjectDetails.userResults.map((result) => (
                      <li key={result.user}>
                        <strong>{result.user}:</strong> {result.correctAnswersCount}/{result.totalQuestions} to'g'ri ({result.correctPercentage}%)
                      </li>
                    ))
                  ) : (
                    <li className="text-gray-500 italic">Natijalar topilmadi.</li>
                  )}
                </ul>
              </div>
            ) : (
              <div className="text-gray-600 italic">Fan bo'yicha ma'lumotlarni yuklash...</div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
