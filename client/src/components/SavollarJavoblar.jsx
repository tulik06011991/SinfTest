import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Quiz = () => {
    const [subjects, setSubjects] = useState([]); // Fanlar ro'yxati
    const [selectedSubject, setSelectedSubject] = useState(''); // Tanlangan fanning ID'si
    const [questions, setQuestions] = useState([]); // Savollar ro'yxati
    const [selectedAnswers, setSelectedAnswers] = useState({}); // Belgilangan javoblar
    const [submissionStatus, setSubmissionStatus] = useState(''); // Javoblarni yuborish statusi
    const [result, setResult] = useState(null);
    const navigate = useNavigate();  // Foydalanuvchi natijasi

    // Fanlar ro'yxatini olish uchun alohida endpointdan foydalanish
    useEffect(() => {
        const fetchSubjects = async () => {
            try {
                const response = await axios.get('http://localhost:5000/api/subjects'); // Fanlar ro'yxatini olish
                setSubjects(response.data); // Fanlar ro'yxatini yuklash
            } catch (error) {
                console.error('Fanlarni olishda xato:', error);
            }
        };
        fetchSubjects(); // useEffect ichida fetch funksiyani chaqirish
    }, []);
    console.log(subjects);


    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) {
          navigate('/login'); // Token topilmasa, login sahifasiga yo'naltirish
        }
      }, [navigate]);
    

    // Tanlangan fanga ko'ra savollarni olish
    useEffect(() => {
        const fetchQuestions = async () => {
            if (!selectedSubject) return; // Fanning ID'si bo'lmasa, hech narsa qilmaslik

            try {
                const response = await axios.get(`http://localhost:5000/api/questions/subject/${selectedSubject}`); // Tanlangan fanga ko'ra savollarni olish
                setQuestions(response.data); // Savollarni yuklash
            } catch (error) {
                console.error('Savollarni olishda xato:', error);
            }
        };
        fetchQuestions(); // Fanning ID tanlanganida savollarni olish
    }, [selectedSubject]);

    // Javob tanlash funksiyasi
    const handleAnswerSelect = (questionId, selectedOption) => {
        setSelectedAnswers((prevAnswers) => ({
            ...prevAnswers,
            [questionId]: selectedOption
        }));
    };

    // Fan tanlash funksiyasi
    const handleSubjectChange = (event) => {
        setSelectedSubject(event.target.value); // Tanlangan fanning ID sini saqlash
        setQuestions([]); // Savollarni tozalash
        setSelectedAnswers({}); // Belgilangan javoblarni tozalash
        setSubmissionStatus(''); // Javob yuborish statusini tozalash
        setResult(null); // Natijani tozalash
    };

    // Javoblarni yuborish funksiyasi
    const submitAnswers = async () => {
        const token = localStorage.getItem('token'); // Tokenni localStorage'dan olish

        try {
            const response = await axios.post(
                'http://localhost:5000/api/submit-answers',
                {
                    subjectId: selectedSubject, // Tanlangan fan ID si
                    answers: selectedAnswers    // Tanlangan javoblar
                },
                {
                    headers: {
                        'Authorization': `Bearer ${token}` // Tokenni Authorization header orqali yuborish
                    }
                }
            );

            const { message, correctAnswersCount, totalQuestions, correctPercentage } = response.data;

            setSubmissionStatus(message); // Yuborish statusini yangilash
            setResult({
                correctAnswersCount,
                totalQuestions,
                correctPercentage
            });
        } catch (error) {
            console.error('Javoblarni yuborishda xato:', error);
            setSubmissionStatus('Javoblarni yuborishda xato yuz berdi.');
        }
    };

    return (
        <div className="quiz-container bg-gray-100 min-h-screen flex flex-col items-center py-8">
            <h2 className="text-4xl font-bold text-blue-600 mb-6">Quiz Test</h2>

            {/* Fan tanlash dropdown */}
            <label htmlFor="subject-select" className="text-xl font-medium mb-4">Kerakli fan tanlang:</label>
            <select 
                id="subject-select" 
                onChange={handleSubjectChange} 
                className="p-2 mb-6 bg-white border border-gray-300 rounded shadow-lg w-60 focus:outline-none focus:ring-2 focus:ring-blue-500">
                <option value="">-- Fan tanlang --</option>
                {subjects.map((subject) => (
                    <option key={subject._id} value={subject._id}>{subject.name}</option>
                ))}
            </select>

            {/* Savollarni ko'rsatish */}
            {questions.length === 0 ? (
                <p className="text-lg font-medium text-gray-700">{selectedSubject ? 'Savollar yo\'q' : 'Iltimos, fan tanlang'}</p>
            ) : (
                <div className="w-full md:w-3/4 lg:w-1/2">
                    {questions.map((question, index) => (
                        <div key={question._id} className="question-block mb-6 p-4 bg-white shadow-md rounded-lg">
                            <h3 className="text-xl font-semibold mb-4">{index + 1}. {question.question}</h3>
                            <ul className="space-y-3">
                                {question.options.map((option) => (
                                    <li key={option.text} className="text-lg">
                                        <label className="flex items-center space-x-3">
                                            <input
                                                type="radio"
                                                name={`question-${question._id}`}
                                                value={option.text}
                                                checked={selectedAnswers[question._id] === option.text}
                                                onChange={() => handleAnswerSelect(question._id, option.text)}
                                                className="h-5 w-5 text-blue-500 focus:ring-blue-400"
                                            />
                                            <span>{option.text}</span>
                                        </label>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>
            )}

            {/* Natijalarni yuborish tugmasi */}
            <button 
                onClick={submitAnswers}
                className="mt-6 px-6 py-2 bg-blue-600 text-white text-lg font-medium rounded-lg shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-400">
                Natijalarni Yuborish
            </button>

            {/* Yuborish natijasini ko'rsatish */}
            {submissionStatus && (
                <p className="mt-4 text-lg font-medium text-green-600">{submissionStatus}</p>
            )}

            {/* Foydalanuvchi natijalarini ko'rsatish */}
            {result && (
                <div className="mt-6 p-4 bg-white shadow-md rounded-lg">
                    <p className="text-xl font-semibold">Sizning Natijalaringiz:</p>
                    <p className="text-lg">To'g'ri javoblar: {result.correctAnswersCount} / {result.totalQuestions}</p>
                    <p className="text-lg">To'g'ri javoblar foizi: {result.correctPercentage}%</p>
                </div>
            )}
        </div>
    );
};

export default Quiz;
