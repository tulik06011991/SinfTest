const fs = require('fs');
const path = require('path');
const Question = require('../Model/questionModel');
const Option = require('../Model/options');
const mammoth = require('mammoth');

// Fayldan matn olish va tahlil qilish funksiyasi
exports.extractAndSave = async (req, res) => {
    try {
        // URL orqali kelayotgan fanId ni olish
        const { fanId } = req.body;

        if (!fanId) {
            return res.status(400).json({
                message: "Fan ID kiritilishi shart!"
            });
        }

        // Yuklangan Word faylidan matn oling
        const filePath = path.join(__dirname, '../', req.file.path);
        const result = await mammoth.extractRawText({ path: filePath });
        const text = result.value; // Word faylidagi matn

        // Fayl mazmunini ajratish
        const lines = text.split('\n'); // Har bir qatorni ajratib olamiz
        let currentQuestion = null;
        let isValid = false; // Savol yoki variant borligini tekshirish uchun flag

        for (let line of lines) {
            line = line.trim();

            // Agar raqam va . bilan boshlanib, oxirida . yoki ? bilan tugasa, bu savol hisoblanadi
            if (/^\d+\./.test(line) && /[.?]$/.test(line)) {
                isValid = true; // Savol borligi aniqlandi

                // Savolni yarating va saqlang
                const newQuestion = new Question({
                    questionText: line,
                    fanId: fanId, // Savolni fanga bog'lash
                    options: []
                });
                currentQuestion = await newQuestion.save(); // Yangi savol saqlanadi
            } 
            // Agar A) yoki B) bilan boshlansa, bu variant hisoblanadi
            else if (/^[A-D]\)/.test(line) || /^\.[A-D]\)/.test(line)) {
                if (!currentQuestion) {
                    return res.status(400).json({
                        message: "Variantlarni saqlashdan oldin savol kiritilishi kerak!"
                    });
                }

                // Oldida . bo'lsa, to'g'ri variant
                const isCorrect = /^\.[A-D]\)/.test(line);
                // Agar to'g'ri variant bo'lsa, .A) kabi nuqta bilan boshlanadigan qismini olib tashlaymiz
                const optionText = line.replace(/^\.[A-D]\)/, '').replace(/^[A-D]\)/, '').trim();

                // Variantni saqlash
                const newOption = new Option({
                    optionText: optionText,
                    isCorrect: isCorrect,
                    question: currentQuestion._id // Savol bilan bog'lash
                });
                const savedOption = await newOption.save();

                // Savolga variant ID'sini qo'shish
                currentQuestion.options.push(savedOption._id);
                await currentQuestion.save();
            }
        }

        // Agar hech qanday savol yoki variant topilmasa, foydalanuvchiga xabar bering
        if (!isValid) {
            return res.status(400).json({
                message: "Yuklangan faylda hech qanday savol yoki variant topilmadi. Iltimos, faylni tekshiring!"
            });
        }

        res.status(200).json({ message: "Savollar va variantlar muvaffaqiyatli saqlandi!" });
        
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Serverda xatolik yuz berdi!" });
    }
};
