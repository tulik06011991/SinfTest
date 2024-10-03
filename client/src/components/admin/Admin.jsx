// AdminCrud.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';

const AdminCrud = () => {
  const [admins, setAdmins] = useState([]);
  const [newAdmin, setNewAdmin] = useState({
    name: '',
    email: '',
    password: '',
    subject: ''
  });
  const [editAdmin, setEditAdmin] = useState(null);

  // Barcha adminlarni olish
  useEffect(() => {
    fetchAdmins();
  }, []);

  const fetchAdmins = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/admins'); // Barcha adminlarni oladi
      setAdmins(response.data);
    } catch (error) {
      console.error('Adminlarni olishda xato:', error);
    }
  };

  // Yangi admin yaratish
  const createAdmin = async () => {
    try {
      const response = await axios.post('http://localhost:5000/api/admin', newAdmin);
      setAdmins([...admins, response.data.newAdmin]);
      setNewAdmin({ name: '', email: '', password: '', subject: '' });
    } catch (error) {
      console.error('Admin yaratishda xato:', error);
    }
  };

  // Adminni yangilash
  const updateAdmin = async (id) => {
    try {
      const response = await axios.put(`http://localhost:5000/api/admin/${id}`, editAdmin);
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
    try {
      await axios.delete(`http://localhost:5000/api/admin/${id}`);
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
    <div>
      <h1>Admin CRUD Operatsiyalari</h1>

      {/* Admin yaratish */}
      <div>
        <h3>Yangi Admin Qo'shish</h3>
        <input
          type="text"
          name="name"
          placeholder="Ismi"
          value={newAdmin.name}
          onChange={handleChange}
        />
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={newAdmin.email}
          onChange={handleChange}
        />
        <input
          type="password"
          name="password"
          placeholder="Parol"
          value={newAdmin.password}
          onChange={handleChange}
        />
        <input
          type="text"
          name="subject"
          placeholder="Fan"
          value={newAdmin.subject}
          onChange={handleChange}
        />
        <button onClick={createAdmin}>Admin Yaratish</button>
      </div>

      {/* Admin ro'yxati */}
      <h2>Adminlar Ro'yxati</h2>
      <ul>
        {admins.map((admin) => (
          <li key={admin._id}>
            <strong>{admin.name}</strong> ({admin.email}) - Fan: {admin.subject}
            <button onClick={() => deleteAdmin(admin._id)}>O'chirish</button>
            <button onClick={() => setEditAdmin(admin)}>Tahrirlash</button>
          </li>
        ))}
      </ul>

      {/* Adminni yangilash */}
      {editAdmin && (
        <div>
          <h3>Adminni Yangilash</h3>
          <input
            type="text"
            name="name"
            placeholder="Ismi"
            value={editAdmin.name}
            onChange={handleEditChange}
          />
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={editAdmin.email}
            onChange={handleEditChange}
          />
          <input
            type="text"
            name="subject"
            placeholder="Fan"
            value={editAdmin.subject}
            onChange={handleEditChange}
          />
          <button onClick={() => updateAdmin(editAdmin._id)}>Yangilash</button>
        </div>
      )}
    </div>
  );
};

export default AdminCrud;
