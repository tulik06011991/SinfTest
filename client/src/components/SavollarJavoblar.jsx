import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Quiz = () => {
    const [subjects, setSubjects] = useState([]); // Fanlar ro'yxati
    const [selectedSubject, setSelectedSubject] = useState(''); // Tanlangan fanning ID'si
    const [questions, setQuestions] = useState([]); // Savollar ro'yxati
    const [selectedAnswers, setSelectedAnswers] = useState({}); // Belgilangan javoblar
    const [submissionStatus, setSubmissionStatus] = useState(''); // Javoblarni yuborish statusi

    // Fanlar ro'yxatini backenddan olish
    useEffect(() => {
        const fetchSubjects = async () => {
            try {
                const response = await axios.get('http://localhost:5000/api/subjects');
                setSubjects(response.data); // Backenddan kelgan fanlar ro'yxatini yuklaymiz
            } catch (error) {
                console.error('Fanlarni olishda xato:', error);
            }
        };
        fetchSubjects();
    }, []);

    // Tanlangan fanga ko'ra savollarni olish
    useEffect(() => {
        const fetchQuestions = async () => {
            if (!selectedSubject) return;

            try {
                const response = await axios.get(`http://localhost:5000/api/questions/subject/${selectedSubject}`);
                setQuestions(response.data); // Backenddan savollarni yuklaymiz
            } catch (error) {
                console.error('Savollarni olishda xato:', error);
            }
        };
        fetchQuestions();
    }, [selectedSubject]);

    // Javob tanlash
    const handleAnswerSelect = (questionId, selectedOption) => {
        setSelectedAnswers((prevAnswers) => ({
            ...prevAnswers,
            [questionId]: selectedOption
        }));
    };

    // Fan tanlash funksiyasi
    const handleSubjectChange = (event) => {
        setSelectedSubject(event.target.value); // Fan ID si
        setQuestions([]); // Savollarni tozalaymiz
        setSelectedAnswers({}); // Belgilangan javoblarni tozalaymiz
        setSubmissionStatus(''); // Javob yuborish statusini tozalaymiz
    };

    // Javoblarni backendga yuborish
   // Javoblarni backendga yuborish
const submitAnswers = async () => {
    const token = localStorage.getItem('token'); // Tokenni localStorage'dan olish

    try {
        const response = await axios.post(
            'http://localhost:5000/api/submit-answers',
            {
                subjectId: selectedSubject, // Fan ID
                answers: selectedAnswers    // Savollar va variantlar IDlari
            },
            {
                headers: {
                    'Authorization': `Bearer ${token}` // Tokenni Authorization header orqali yuborish
                }
            }
        );
        setSubmissionStatus(response.data.message);
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
        </div>
    );
};

export default Quiz;
