import React, { useState, useEffect } from 'react';
import axios from 'axios'; // Backend bilan muloqot qilish uchun axiosni import qilamiz

const Quiz = () => {
    const [subjects, setSubjects] = useState(['Matematika', 'Kimyo', 'Biologiya']); // Fanlar ro'yxati
    const [selectedSubject, setSelectedSubject] = useState(''); // Tanlangan fan
    const [questions, setQuestions] = useState([]); // Savollarni saqlash uchun state
    const [selectedAnswers, setSelectedAnswers] = useState({}); // Foydalanuvchining tanlagan javoblari

    // Backenddan savollarni olish uchun useEffect
    useEffect(() => {
        const fetchQuestions = async () => {
            if (!selectedSubject) return; // Tanlangan fan bo'lmasa hech narsa qilmaymiz

            try {
                const response = await axios.get(`http://localhost:5000/api/questions/subject/${selectedSubject.toLowerCase()}`); // API chaqiruv tanlangan fan bilan
                setQuestions(response.data); // Savollarni state ga o'rnatamiz
            } catch (error) {
                console.error('Savollarni olishda xato:', error);
            }
        };
        fetchQuestions();
    }, [selectedSubject]); // selectedSubject o'zgarganda savollarni qayta yuklaymiz

    // Foydalanuvchi variantni tanlaganda uni saqlash
    const handleAnswerSelect = (questionId, selectedOption) => {
        setSelectedAnswers((prevAnswers) => ({
            ...prevAnswers,
            [questionId]: selectedOption
        }));
    };

    // Fanni tanlashni boshqarish
    const handleSubjectChange = (event) => {
        setSelectedSubject(event.target.value);
        setQuestions([]); // Fan tanlanganda eski savollarni tozalash
        setSelectedAnswers({}); // Javoblarni tozalash
    };

    // Savollar va variantlarni render qilish
    return (
        <div className="quiz-container">
            <h2>Quiz Test</h2>
            
            {/* Fan tanlash dropdown */}
            <label htmlFor="subject-select">Kerakli fan tanlang:</label>
            <select id="subject-select" onChange={handleSubjectChange}>
                <option value="">-- Fan tanlang --</option>
                {subjects.map((subject) => (
                    <option key={subject} value={subject}>{subject}</option>
                ))}
            </select>

            {/* Savollarni ko'rsatish */}
            {questions.length === 0 ? (
                <p>{selectedSubject ? 'Savollar yo\'q' : 'Iltimos, fan tanlang'}</p>
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
