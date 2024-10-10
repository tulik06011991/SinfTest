const jwt = require('jsonwebtoken');
const Answer = require('../Model/Javoblar'); // To'g'ri model
const Question = require('../Model/questionModel'); // To'g'ri model
require('dotenv').config();

const submitAnswers = async (req, res) => {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
        return res.status(401).json({ message: 'Token mavjud emas' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const userId = decoded.userId;

        const { subjectId, answers, userName } = req.body;

        let savedAnswers = [];
        let correctAnswersCount = 0;
        const totalQuestions = answers.length;

        for (let i = 0; i < answers.length; i++) {
            const { questionId, selectedOption } = answers[i];
            const question = await Question.findById(questionId);

            if (question) {
                const selectedOptionObj = question.options.find(option => option.text === selectedOption);
                const isCorrect = selectedOptionObj?.isCorrect;

                if (isCorrect) {
                    correctAnswersCount++;
                }

                const answer = new Answer({
                    userId,
                    userName,
                    subjectId,
                    answers: [
                        {
                            questionId,
                            selectedOption
                        }
                    ]
                });
                await answer.save();
                savedAnswers.push(answer);
            }
        }

        const correctPercentage = (correctAnswersCount / totalQuestions) * 100;

        return res.status(200).json({
            message: 'Javoblar saqlandi',
            correctAnswersCount,
            totalQuestions,
            correctPercentage
        });
    } catch (error) {
        console.error('Javoblarni yuborishda xato:', error);
        return res.status(500).json({ message: 'Serverda xato yuz berdi' });
    }
};

module.exports = { submitAnswers };
