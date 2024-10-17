import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom'; // Import useNavigate

const AdminCrud = () => {
  const [admins, setAdmins] = useState([]);
  const [newAdmin, setNewAdmin] = useState({
    name: '',
    email: '',
    password: '',
    subject: ''
  });
  const [editAdmin, setEditAdmin] = useState(null);
  const navigate = useNavigate();
  // Initialize useNavigate

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/'); // Token bo'lmasa login sahifasiga yo'naltirish
    }
  }, [navigate]);

  // Barcha adminlarni olish
  useEffect(() => {
    fetchAdmins();
  }, []);

  const fetchAdmins = async () => {
    const token  = localStorage.getItem('token') 
    try {
      const response = await axios.get('http://localhost:5000/api/admins',
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      ); // Barcha adminlarni oladi
      setAdmins(response.data);
    } catch (error) {
      console.error('Adminlarni olishda xato:', error);
    }
  };

  // Yangi admin yaratish
  const createAdmin = async () => {
    const token = localStorage.getItem('token'); 
    try {
        const response = await axios.post('http://localhost:5000/api/admin',
            newAdmin, // Bu yerda ma'lumotlar
            {
                headers: {
                    Authorization: `Bearer ${token}` // Tokenni headers'ga qo'shamiz
                },
            });
        setAdmins([...admins, response.data.newAdmin]);
        setNewAdmin({ name: '', email: '', password: '', subject: '' });
    } catch (error) {
        console.error('Admin yaratishda xato:', error);
    }
};

  // Adminni yangilash
  const updateAdmin = async (id) => {
    const token  = localStorage.getItem('token') 
    try {
      const response = await axios.put(`http://localhost:5000/api/admin/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }, editAdmin);
      const updatedAdmins = admins.map((admin) =>
        admin._id === id ? response.data.updatedAdmin : admin
      );
      setAdmins(updatedAdmins);
      setEditAdmin(null); // Edit rejimini tugatish
    } catch (error) {
      console.error('Adminni yangilashda xato:', error);
    }
  };

  // Adminni o'chirish
  const deleteAdmin = async (id) => {
    const token  = localStorage.getItem('token') 
    try {
      await axios.delete(`http://localhost:5000/api/admin/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );
      setAdmins(admins.filter((admin) => admin._id !== id));
    } catch (error) {
      console.error('Adminni o\'chirishda xato:', error);
    }
  };

  // Inputlar o'zgarishi
  const handleChange = (e) => {
    setNewAdmin({
      ...newAdmin,
      [e.target.name]: e.target.value
    });
  };

  const handleEditChange = (e) => {
    setEditAdmin({
      ...editAdmin,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      <h1 style={{ textAlign: 'center', color: '#333' }}>Admin CRUD Operatsiyalari</h1>

      {/* Admin yaratish */}
      <div style={{
        backgroundColor: '#f9f9f9',
        padding: '20px',
        borderRadius: '8px',
        boxShadow: '0 0 10px rgba(0, 0, 0, 0.1)',
        marginBottom: '20px',
        maxWidth: '600px',
        margin: '0 auto'
      }}>
        <h3 style={{ textAlign: 'center' }}>Yangi Admin Qo'shish</h3>
        <input
          type="text"
          name="name"
          placeholder="Ismi"
          value={newAdmin.name}
          onChange={handleChange}
          style={inputStyle}
        />
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={newAdmin.email}
          onChange={handleChange}
          style={inputStyle}
        />
        <input
          type="password"
          name="password"
          placeholder="Parol"
          value={newAdmin.password}
          onChange={handleChange}
          style={inputStyle}
        />
        <input
          type="text"
          name="subject"
          placeholder="Fan"
          value={newAdmin.subject}
          onChange={handleChange}
          style={inputStyle}
        />
        <button onClick={createAdmin} style={buttonStyle}>Admin Yaratish</button>
      </div>

      {/* Admin ro'yxati */}
      <h2 style={{ textAlign: 'center', color: '#555' }}>Adminlar Ro'yxati</h2>
      <ul style={{
        listStyle: 'none',
        padding: 0,
        maxWidth: '600px',
        margin: '0 auto'
      }}>
        {admins.map((admin) => (
          <li key={admin._id} style={{
            backgroundColor: '#fff',
            padding: '10px 20px',
            margin: '10px 0',
            borderRadius: '8px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            boxShadow: '0 0 5px rgba(0, 0, 0, 0.1)'
          }}>
            <span>
              <strong>{admin.name}</strong> ({admin.email}) - Fan: {admin.subject}
            </span>
            <div>
              <button onClick={() => deleteAdmin(admin._id)} style={buttonStyle}>O'chirish</button>
              <button onClick={() => setEditAdmin(admin)} style={buttonStyle}>Tahrirlash</button>
            </div>
          </li>
        ))}
      </ul>

      {/* Adminni yangilash */}
      {editAdmin && (
        <div style={{
          backgroundColor: '#f9f9f9',
          padding: '20px',
          borderRadius: '8px',
          boxShadow: '0 0 10px rgba(0, 0, 0, 0.1)',
          maxWidth: '600px',
          margin: '20px auto'
        }}>
          <h3 style={{ textAlign: 'center' }}>Adminni Yangilash</h3>
          <input
            type="text"
            name="name"
            placeholder="Ismi"
            value={editAdmin.name}
            onChange={handleEditChange}
            style={inputStyle}
          />
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={editAdmin.email}
            onChange={handleEditChange}
            style={inputStyle}
          />
          <input
            type="text"
            name="subject"
            placeholder="Fan"
            value={editAdmin.subject}
            onChange={handleEditChange}
            style={inputStyle}
          />
          <button onClick={() => updateAdmin(editAdmin._id)} style={buttonStyle}>Yangilash</button>
        </div>
      )}

      {/* Dashboardga o'tish uchun tugma */}
      <div style={{ textAlign: 'center', marginTop: '20px' }}>
        <button onClick={() => navigate('/superadmin')} style={buttonStyle}>Superadminga O'tish</button>
      </div>
    </div>
  );
};

// Stil yozuvlari
const inputStyle = {
  width: '100%',
  padding: '10px',
  margin: '5px 0',
  borderRadius: '4px',
  border: '1px solid #ccc',
  fontSize: '16px',
};

const buttonStyle = {
  padding: '10px 15px',
  margin: '5px',
  backgroundColor: '#007bff',
  color: '#fff',
  border: 'none',
  borderRadius: '4px',
  cursor: 'pointer',
  fontSize: '16px',
};

export default AdminCrud;
