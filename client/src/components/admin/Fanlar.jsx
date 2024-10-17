import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const CreateSubject = () => {
  const [subjectName, setSubjectName] = useState(''); // Kirtilgan fan nomini saqlash
  const [adminId, setAdminId] = useState(''); // Tanlangan admin ID sini saqlash
  const [admins, setAdmins] = useState([]); // Barcha adminlarni saqlash
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Tokenni tekshirish va agar yo'q bo'lsa, login sahifasiga yo'naltirish
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/');
    }
  }, [navigate]);

  // Adminlar ro'yxatini olish
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const token = localStorage.getItem('token');
        
        // Adminlarni olish
        const adminsResponse = await axios.get('http://localhost:5000/api/admins', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setAdmins(adminsResponse.data);
      } catch (error) {
        console.error('Ma\'lumotlarni olishda xato:', error);
        setMessage('Ma\'lumotlarni olishda xato yuz berdi.');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // Formani submit qilganda fan yaratish funksiyasi
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const token = localStorage.getItem('token');

    try {
      const response = await axios.post(
        'http://localhost:5000/admin/create',
        { name: subjectName, adminId }, // Fan nomi va adminId ni post qilamiz
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log(response);
      
      setMessage(response.data.message);
      navigate('/superadmin'); // Fan yaratgandan keyin superadmin paneliga o'tkazish
    } catch (error) {
      if (error.response && error.response.status === 400) {
        setMessage('Bu fan allaqachon mavjud!');
      } else {
        console.error('Fan yaratishda xato:', error);
        setMessage('Fan yaratishda xato yuz berdi!');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-md mt-10">
      <h2 className="text-2xl font-semibold text-center text-gray-800 mb-6">Yangi Fan Yaratish</h2>

      {/* Yuklanmoqda animatsiyasi */}
      {loading ? (
        <p className="text-center text-blue-500">Yuklanmoqda...</p>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          
          {/* Fan nomini qo'lda kiritish */}
          <div className="flex flex-col">
            <label htmlFor="subject" className="mb-1 text-gray-600">Fan Nomi:</label>
            <input
              type="text"
              id="subject"
              value={subjectName} // subjectName ni ishlatamiz
              onChange={(e) => setSubjectName(e.target.value)} // subjectName ni yangilaymiz
              required
              placeholder="Fan nomini kiriting"
              className="p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Admin tanlash */}
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
      )}

      {/* Superadmin paneliga o'tish uchun tugma */}
      <button
        onClick={() => navigate('/superadmin')}
        className="mt-4 w-full bg-green-500 text-white py-2 rounded-md hover:bg-green-600 transition-colors duration-300"
      >
        Superadmin Paneliga O'tish
      </button>
    </div>
  );
};

export default CreateSubject;
