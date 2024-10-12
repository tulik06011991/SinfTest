import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios'; // axios import qilish

const SuperadminPanel = () => {
  const [activeTab, setActiveTab] = useState('users');
  const [users, setUsers] = useState([]);
  const [newUser, setNewUser] = useState('');
  const navigate = useNavigate()

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/'); // Token bo'lmasa login sahifasiga yo'naltirish
    }
  }, [navigate]);

  useEffect(() => {
    const fetchUsers = async () => {
      const token = localStorage.getItem('token');
      try {
        const response = await axios.get('http://localhost:5000/api/dashboard', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setUsers(response.data);
      } catch (error) {
        console.error('Xatolik:', error);
      }
    };
    fetchUsers();
  }, []);

  // Foydalanuvchilar CRUD
  const createUser = async () => {
    const user = { name: newUser };
    try {
      const response = await axios.post('http://localhost:5000/api/dashboard',
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }, user);
      setUsers([...users, response.data]); // Yangi foydalanuvchini ro'yxatga qo'shish
      setNewUser(''); // Inputni tozalash
    } catch (error) {
      console.error('Xatolik:', error);
    }
  };

  const deleteUser = async (id) => {
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`http://localhost:5000/api/users/${id}`,

        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      ); // Foydalanuvchini o'chirish
      setUsers(users.filter((user) => user._id !== id)); // O'chirilgan foydalanuvchini ro'yxatdan olib tashlash
    } catch (error) {
      console.error('Xatolik:', error);
    }
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
                    <th className="px-4 py-2 border">Emaili</th>
                    <th className="px-4 py-2 border">Foydalanuvchi Ismi</th>
                    <th className="px-4 py-2 border">Amallar</th>
                  </tr>
                </thead>
                <tbody>
                  {users.length > 0 ? (
                    users.map((user) => (
                      <tr key={user._id} className="border-b border-gray-300">
                        <td className="px-4 py-2 text-center">{user.email}</td>
                        <td className="px-4 py-2">{user.name}</td>
                        <td className="px-4 py-2 text-center">
                          <button
                            onClick={() => deleteUser(user._id)}
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
