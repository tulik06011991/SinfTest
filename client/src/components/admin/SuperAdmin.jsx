import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios'; // axios import qilish

const SuperadminPanel = () => {
  const [activeTab, setActiveTab] = useState('users');
  const [users, setUsers] = useState([]);
  const [newUser, setNewUser] = useState('');

  useEffect(() => {
    const token = localStorage.getItem('token');
    // Backend API orqali ma'lumotlarni olish
    const response  = axios.get('http://localhost:5000/api/admin/dashboard',
      {headers: {
        Authorization: `Bearer ${token}`,
      },
    })
    .then((response) => {
      setUsers(response.data);
    })
    .catch((error) => {
      console.error('Xatolik:', error);
    });
  }, []);
  
  console.log(users);

  // Foydalanuvchilar CRUD
  const createUser = () => {
    const user = { name: newUser };
    axios.post('/api/users', user)
      .then((response) => {
        setUsers([...users, response.data]); // Yangi foydalanuvchini ro'yxatga qo'shish
        setNewUser('');
      })
      .catch((error) => {
        console.error('Xatolik:', error);
      });
  };

  const deleteUser = (id) => {
    axios.delete(`/api/users/${id}`)
      .then(() => {
        setUsers(users.filter((user) => user.id !== id));
      })
      .catch((error) => {
        console.error('Xatolik:', error);
      });
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Navbar */}
      <nav className="bg-blue-600 p-4 text-white flex justify-between">
        <div className="flex space-x-4">
          <button
            className={`${activeTab === 'users' ? 'border-b-4 border-white' : ''} py-2 px-4`}
            onClick={() => setActiveTab('users')}
          >
            Foydalanuvchilar
          </button>

          <Link to="/quiz">
            <button
              className={`${activeTab === 'admins' ? 'border-b-4 border-white' : ''} py-2 px-4`}
              onClick={() => setActiveTab('admins')}
            >
              Adminlar
            </button>
          </Link>

          <Link to="/fanlar">
            <button
              className={`${activeTab === 'categories' ? 'border-b-4 border-white' : ''} py-2 px-4`}
              onClick={() => setActiveTab('categories')}
            >
              Fanlar
            </button>
          </Link>
        </div>
      </nav>

      {/* Content */}
      <div className="p-6">
        {activeTab === 'users' && (
          <div>
            <h2 className="text-2xl font-bold mb-4">Foydalanuvchilar</h2>
            <input
              type="text"
              value={newUser}
              onChange={(e) => setNewUser(e.target.value)}
              className="border p-2 mb-4"
              placeholder="Yangi foydalanuvchi ismi"
            />
            <button onClick={createUser} className="bg-blue-500 text-white px-4 py-2 rounded">
              Yaratish
            </button>

            <div className="overflow-x-auto mt-4">
              <table className="min-w-full bg-white border border-gray-300">
                <thead>
                  <tr>
                    <th className="px-4 py-2 border">ID</th>
                    <th className="px-4 py-2 border">Foydalanuvchi Ismi</th>
                    <th className="px-4 py-2 border">Amallar</th>
                  </tr>
                </thead>
                <tbody>
                  {users.length > 0 ? (
                    users.map((user) => (
                      <tr key={user.id} className="border-b border-gray-300">
                        <td className="px-4 py-2 text-center">{user.id}</td>
                        <td className="px-4 py-2">{user.name}</td>
                        <td className="px-4 py-2 text-center">
                          <button
                            onClick={() => deleteUser(user.id)}
                            className="text-red-600 hover:text-red-800"
                          >
                            O'chirish
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="3" className="text-gray-500 italic text-center py-4">
                        Foydalanuvchilar topilmadi.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SuperadminPanel;
