import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom'; // Link import qilish

const SuperadminPanel = () => {
  const [activeTab, setActiveTab] = useState('users'); // Foydalanuvchilar default tanlanadi
  const [users, setUsers] = useState([]);
  const [admins, setAdmins] = useState([]);
  const [categories, setCategories] = useState([]);

  const [newUser, setNewUser] = useState('');
  const [newAdmin, setNewAdmin] = useState('');
  const [newCategory, setNewCategory] = useState('');

  useEffect(() => {
    // Backend API orqali ma'lumotlarni olish
    fetch('/http://localhost:5000/api/users').then((response) => response.json()).then((data) => setUsers(data));
   
  }, []);
  // Foydalanuvchilar CRUD
  const createUser = () => {
    const user = { name: newUser };
    fetch('/api/users', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(user),
    }).then(() => {
      setUsers([...users, user]);
      setNewUser('');
    });
  };

  const deleteUser = (id) => {
    fetch(`/api/users/${id}`, { method: 'DELETE' }).then(() => {
      setUsers(users.filter((user) => user.id !== id));
    });
  };

  // Adminlar CRUD
  


  // Kategoriyalar CRUD
  

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
          
          <Link to="/admin">
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
              Fanlar Kategoriyasi
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

            <ul className="mt-4 space-y-2">
              {users.map((user) => (
                <li key={user.id} className="flex justify-between p-2 bg-white shadow">
                  {user.name}
                  <button
                    onClick={() => deleteUser(user.id)}
                    className="text-red-600 hover:underline"
                  >
                    O'chirish
                  </button>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

export default SuperadminPanel;
