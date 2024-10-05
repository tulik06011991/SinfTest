import React, { useState } from 'react';
import axios from 'axios';

const Dashboard = () => {
  const [subjects, setSubjects] = useState([]); // Bo'sh array sifatida boshlang'ich qiymat
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const fetchSubjects = async () => {
    setLoading(true);
    try {
      // LocalStorage'dan tokenni olish
      const token = localStorage.getItem('token');

      if (!token) {
        setError('Token topilmadi. Iltimos, qayta login qiling.');
        return;
      }

      // Backendga tokenni jo'natish
      const response = await axios.get('http://localhost:5000/admin/subjects', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      // Backenddan kelgan fanlarni saqlash
      setSubjects(response.data.subjects);
    } catch (err) {
      setError('Ma\'lumotlarni olishda xatolik yuz berdi.');
      console.error(err); // Xatoni konsolga chiqarish
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="dashboard">
      <h1>Admin Dashboard</h1>
      <h2>Biriktirilgan fanlar</h2>
      <button onClick={fetchSubjects}>Fanlarni yuklash</button> {/* Tugma */}
      {loading && <div>Yuklanmoqda...</div>}
      {error && <div>Xato: {error}</div>}
      <ul>
        {subjects.length > 0 ? (
          subjects.map((subject) => (
            <li key={subject._id}>{subject.name}</li>
          ))
        ) : (
          <li>Fanlar topilmadi.</li>
        )}
      </ul>
    </div>
  );
};

export default Dashboard;
