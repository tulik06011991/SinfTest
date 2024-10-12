import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom'; // useNavigate ni import qilish

const CreateSubject = () => {
  const [name, setName] = useState(''); // Fan nomini saqlash
  const [adminId, setAdminId] = useState(''); // Tanlangan admin ID sini saqlash
  const [admins, setAdmins] = useState([]); // Barcha adminlarni saqlash
  const [message, setMessage] = useState(''); // Xabarni saqlash
  const navigate = useNavigate(); // navigate funksiya yaratish

  // Backenddan adminlar ro'yxatini olish uchun useEffect



  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/'); // Token bo'lmasa login sahifasiga yo'naltirish
    }
  }, [navigate]);
  
  useEffect(() => {
    const fetchAdmins = async () => {
      try {
        const token = localStorage.getItem('token')
        const response = await axios.get('http://localhost:5000/api/admins',
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        ); // Adminlarni olish
        setAdmins(response.data); // Adminlarni state ga o'rnatamiz
      } catch (error) {
        console.error('Adminlarni olishda xato:', error);
      }
    };
    fetchAdmins();
  }, []);

  // Formani submit qilganda fan yaratish funksiyasi
  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    
    try {
        const response = await axios.post('http://localhost:5000/api/create',
            { name, adminId }, // Ma'lumotlarni birinchi parametr sifatida yuboramiz
            {
                headers: {
                    Authorization: `Bearer ${token}` // Tokenni headers'ga qo'shamiz
                },
            }
        );
        setMessage(response.data.message); // Xabarni o'rnatamiz
    } catch (error) {
        if (error.response && error.response.status === 400) {
            // Agar status kodi 400 bo'lsa, bu fan allaqachon mavjud deb xabar chiqaramiz
            setMessage('Bu fan allaqachon mavjud!');
        } else {
            // Boshqa xatoliklar uchun umumiy xabar
            console.error('Fan yaratishda xato:', error);
            setMessage('Fan yaratishda xato yuz berdi!');
        }
    }
};


  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-md mt-10">
      <h2 className="text-2xl font-semibold text-center text-gray-800 mb-6">Yangi Fan Yaratish</h2>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="flex flex-col">
          <label htmlFor="name" className="mb-1 text-gray-600">Fan Nomi:</label>
          <input
            type="text"
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            placeholder="Fan nomini kiriting"
            className="p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        
        <div className="flex flex-col">
          <label htmlFor="admin" className="mb-1 text-gray-600">Adminni Tanlang:</label>
          <select
            id="admin"
            value={adminId}
            onChange={(e) => setAdminId(e.target.value)}
            required
            className="p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Adminni tanlang</option>
            {admins.map((admin) => (
              <option key={admin._id} value={admin._id}>
                ({admin.name})
              </option>
            ))}
          </select>
        </div>

        <button
          type="submit"
          className="w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600 transition-colors duration-300"
        >
          Fan Yaratish
        </button>

        {message && <p className="text-center text-red-500 mt-4">{message}</p>}
      </form>

      {/* Superadmin paneliga o'tish uchun tugma */}
      <button
        onClick={() => navigate('/superadmin')} // Bu yerda '/superadmin' yo'liga o'tadi
        className="mt-4 w-full bg-green-500 text-white py-2 rounded-md hover:bg-green-600 transition-colors duration-300"
      >
        Superadmin Paneliga O'tish
      </button>
    </div>
  );
};

export default CreateSubject;
