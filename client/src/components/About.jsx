import React from 'react';

const About = () => {
    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-r from-purple-600 via-pink-500 to-red-500 text-white">
            <div className="bg-white text-gray-800 p-8 rounded-lg shadow-lg max-w-5xl w-full flex flex-col lg:flex-row items-center">
                
                {/* Matn qismi */}
                <div className="lg:w-2/3 mb-8 lg:mb-0">
                    <h1 className="text-4xl font-bold text-center lg:text-left mb-6">Biz haqimizda</h1>
                    <p className="text-lg leading-8 mb-4">
                        Bizning onlayn test platformamizga xush kelibsiz! Bizning maqsadimiz o'quvchilarga bilimlarini oshirish va turli fanlarga tayyorgarlik ko'rishda yordam berishdir.
                    </p>
                    <p className="text-lg leading-8 mb-4">
                        Biz turli mavzular bo'yicha turli xil testlarni taqdim etamiz, ular har xil murakkablik darajalariga mo'ljallangan. Imtihonlarga tayyorlanayotgan bo'lsangiz yoki o'zingizni sinab ko'rishni istasangiz, bizning platformamiz aynan siz uchun.
                    </p>
                    <p className="text-lg leading-8 mb-4">
                        Platformamiz o'quvchilar va o'qituvchilarga testlarni ishlash, natijalarni kuzatish va real vaqt rejimida o'z malakalarini oshirish imkonini beradi. Administrator sifatida siz Word hujjatlaridan to'g'ridan-to'g'ri testlar yuklashingiz va boshqarishingiz mumkin.
                    </p>
                    <p className="text-lg leading-8">
                        Platformamizni bemalol o'rganing va bilim olishingizda yordam berishga har doim tayyormiz. O'qishingizni zavqli qiling!
                    </p>
                </div>
                
                {/* Rasm qismi */}
                <div className="lg:w-1/3 flex justify-center lg:justify-end">
                    <img
                        src="https://via.placeholder.com/300" // Bu yerda o'zingiz xohlagan rasm URL'ni kiriting
                        alt="Biz haqimizda"
                        className="w-full h-auto rounded-lg shadow-lg"
                    />
                </div>
            </div>
        </div>
    );
};

export default About;
