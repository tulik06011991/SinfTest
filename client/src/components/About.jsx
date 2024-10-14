import React from 'react';

const About = () => {
    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-r from-purple-600 via-pink-500 to-red-500 text-white">
            <div className="bg-white text-gray-800 p-8 rounded-lg shadow-lg max-w-3xl w-full">
                <h1 className="text-4xl font-bold text-center mb-6">About Our Platform</h1>
                <p className="text-lg leading-8 mb-4">
                    Welcome to our online quiz platform! Our goal is to help students enhance their knowledge and prepare for various subjects in an interactive and engaging way.
                </p>
                <p className="text-lg leading-8 mb-4">
                    We provide a variety of quizzes across multiple subjects, tailored to different difficulty levels. Whether you're preparing for exams or just want to challenge yourself, you're in the right place.
                </p>
                <p className="text-lg leading-8 mb-4">
                    Our platform allows both students and teachers to interact with quizzes, track progress, and improve in real-time. As an admin, you can upload quizzes directly from Word documents, making quiz management more seamless.
                </p>
                <p className="text-lg leading-8">
                    Feel free to explore the platform, and we are here to support your learning journey. Happy learning!
                </p>
            </div>
        </div>
    );
};

export default About;
