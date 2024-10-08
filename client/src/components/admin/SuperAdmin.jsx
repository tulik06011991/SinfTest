import React, { useState, useEffect } from 'react';

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
    fetch('/api/users').then(response => response.json()).then(data => setUsers(data));
    fetch('/api/admins').then(response => response.json()).then(data => setAdmins(data));
    fetch('/api/categories').then(response => response.json()).then(data => setCategories(data));
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
      setUsers(users.filter(user => user.id !== id));
    });
  };

  // Adminlar CRUD
  const createAdmin = () => {
    const admin = { name: newAdmin };
    fetch('/api/admins', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(admin),
    }).then(() => {
      setAdmins([...admins, admin]);
      setNewAdmin('');
    });
  };

  const deleteAdmin = (id) => {
    fetch(`/api/admins/${id}`, { method: 'DELETE' }).then(() => {
      setAdmins(admins.filter(admin => admin.id !== id));
    });
  };

  // Kategoriyalar CRUD
  const createCategory = () => {
    const category = { name: newCategory };
    fetch('/api/categories', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(category),
    }).then(() => {
      setCategories([...categories, category]);
      setNewCategory('');
    });
  };

  const deleteCategory = (id) => {
    fetch(`/api/categories/${id}`, { method: 'DELETE' }).then(() => {
      setCategories(categories.filter(category => category.id !== id));
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
          <button
            className={`${activeTab === 'admins' ? 'border-b-4 border-white' : ''} py-2 px-4`}
            onClick={() => setActiveTab('admins')}
          >
            Adminlar
          </button>
          <button
            className={`${activeTab === 'categories' ? 'border-b-4 border-white' : ''} py-2 px-4`}
            onClick={() => setActiveTab('categories')}
          >
            Fanlar Kategoriyasi
          </button>
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
              {users.map(user => (
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

        {activeTab === 'admins' && (
          <div>
            <h2 className="text-2xl font-bold mb-4">Adminlar</h2>
            <input
              type="text"
              value={newAdmin}
              onChange={(e) => setNewAdmin(e.target.value)}
              className="border p-2 mb-4"
              placeholder="Yangi admin ismi"
            />
            <button onClick={createAdmin} className="bg-blue-500 text-white px-4 py-2 rounded">
              Yaratish
            </button>

            <ul className="mt-4 space-y-2">
              {admins.map(admin => (
                <li key={admin.id} className="flex justify-between p-2 bg-white shadow">
                  {admin.name}
                  <button
                    onClick={() => deleteAdmin(admin.id)}
                    className="text-red-600 hover:underline"
                  >
                    O'chirish
                  </button>
                </li>
              ))}
            </ul>
          </div>
        )}

        {activeTab === 'categories' && (
          <div>
            <h2 className="text-2xl font-bold mb-4">Fanlar Kategoriyasi</h2>
            <input
              type="text"
              value={newCategory}
              onChange={(e) => setNewCategory(e.target.value)}
              className="border p-2 mb-4"
              placeholder="Yangi kategoriya nomi"
            />
            <button onClick={createCategory} className="bg-blue-500 text-white px-4 py-2 rounded">
              Yaratish
            </button>

            <ul className="mt-4 space-y-2">
              {categories.map(category => (
                <li key={category.id} className="flex justify-between p-2 bg-white shadow">
                  {category.name}
                  <button
                    onClick={() => deleteCategory(category.id)}
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
