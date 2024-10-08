import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';


const UploadFile = () => {
  const [file, setFile] = useState(null); // Faylni saqlash
  const [selectedSubject, setSelectedSubject] = useState(''); // Tanlangan fan
  const [subjects, setSubjects] = useState([]); // Barcha fanlarni saqlash
  const [message, setMessage] = useState(''); // Xabarni saqlash
const navigate = useNavigate()

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/'); // Token topilmasa, login sahifasiga yo'naltirish
    }
  }, [navigate]);

  // Backenddan fanlar ro'yxatini olish uchun useEffect
  useEffect(() => {
    const fetchSubjects = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/subjects'); // Fanlarni olish
        setSubjects(response.data); // Fanlarni state ga o'rnatamiz
      } catch (error) {
        console.error('Fanlarni olishda xato:', error);
      }
    };
    fetchSubjects();
  }, []);

  // Fayl tanlanganida
  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  // Formani submit qilganda fayl yuklash funksiyasi
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!selectedSubject || !file) {
      setMessage('Iltimos, fan va faylni tanlang!');
      return;
    }

    const formData = new FormData();
    formData.append('file', file); // Faylni FormData ga qo'shamiz
    formData.append('subjectId', selectedSubject); // Tanlangan fan ID'sini qo'shamiz

    try {
      const response = await axios.post('http://localhost:5000/api/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      setMessage('Fayl muvaffaqiyatli yuklandi!');
    } catch (error) {
      console.error('Faylni yuklashda xato:', error);
      setMessage('Faylni yuklashda xato yuz berdi!');
    }
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-md mt-10">
      <h2 className="text-2xl font-semibold text-center text-gray-800 mb-6">Fan Tanlash va Fayl Yuklash</h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="flex flex-col">
          <label htmlFor="subject" className="mb-1 text-gray-600">Fan Tanlang:</label>
          <select
            id="subject"
            value={selectedSubject}
            onChange={(e) => setSelectedSubject(e.target.value)}
            required
            className="p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Fan tanlang</option>
            {subjects.map((subject) => (
              <option key={subject._id} value={subject._id}>
                {subject.name}
              </option>
            ))}
          </select>
        </div>

        <div className="flex flex-col">
          <label htmlFor="file" className="mb-1 text-gray-600">Faylni Yuklang:</label>
          <input
            type="file"
            id="file"
            onChange={handleFileChange}
            required
            className="p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <button
          type="submit"
          className="w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600 transition-colors duration-300"
        >
          Yuklash
        </button>

        {message && <p className="text-center text-red-500 mt-4">{message}</p>}
      </form>
    </div>
  );
};

export default UploadFile;
