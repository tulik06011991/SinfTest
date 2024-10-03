import React, { useState, useEffect } from 'react';
import axios from 'axios'; // Backend bilan muloqot qilish uchun axiosni import qilamiz

const Quiz = ({ subject }) => { // subject ni props sifatida qabul qilamiz
    const [questions, setQuestions] = useState([]); // Savollarni saqlash uchun state
    const [selectedAnswers, setSelectedAnswers] = useState({}); // Foydalanuvchining tanlagan javoblari

    // Backenddan savollarni olish uchun useEffect
    useEffect(() => {
        const fetchQuestions = async () => {
            try {
                const response = await axios.get(`http://localhost:5000/api/questions/subject/${'kimyo'}`); // API chaqiruv fan nomi bilan
                setQuestions(response.data); // Savollarni state ga o'rnatamiz
            } catch (error) {
                console.error('Savollarni olishda xato:', error);
            }
        };
        fetchQuestions();
    }, [subject]); // subject ga o'zgarganda savollarni qayta yuklaymiz

    // Foydalanuvchi variantni tanlaganda uni saqlash
    const handleAnswerSelect = (questionId, selectedOption) => {
        setSelectedAnswers((prevAnswers) => ({
            ...prevAnswers,
            [questionId]: selectedOption
        }));
    };

    // Savollar va variantlarni render qilish
    return (
        <div className="quiz-container">
            <h2>Quiz Test</h2>
            {questions.length === 0 ? (
                <p>Savollar yuklanmoqda...</p>
            ) : (
                questions.map((question, index) => (
                    <div key={question._id} className="question-block">
                        <h3>{index + 1}. {question.question}</h3>
                        <ul>
                            {question.options.map((option) => (
                                <li key={option.text}>
                                    <label>
                                        <input
                                            type="radio"
                                            name={`question-${question._id}`}
                                            value={option.text}
                                            checked={selectedAnswers[question._id] === option.text}
                                            onChange={() => handleAnswerSelect(question._id, option.text)}
                                        />
                                        {option.text}
                                    </label>
                                </li>
                            ))}
                        </ul>
                    </div>
                ))
            )}
            <button onClick={() => console.log(selectedAnswers)}>Natijalarni Yuborish</button>
        </div>
    );
};

export default Quiz;
