'use client'
import React, { useState, useEffect } from 'react';

const ManageUser = () => {
  const [users, setUsers] = useState([]);

  useEffect(() => {
  
    const mockUsers = [
      { id: 1, name: 'khushi', role: 'Editor' },
      { id: 2, name: 'ruchi', role: 'Viewer' },
    ];
    setUsers(mockUsers);
  }, []);

  const handleUpdate = (userId) => {
    console.log(`Update user with ID: ${userId}`);
 
  };

  const handleDelete = (userId) => {
    console.log(`Delete user with ID: ${userId}`);
    
  };

  return (
    <div className="p-4 max-w-full overflow-x-auto">
      <h1 className="text-2xl font-bold mb-4">Manage Users</h1>
      <table className="min-w-full border border-gray-300 text-sm md:text-base">
        <thead>
          <tr className="bg-gray-100">
            <th className="border px-4 py-2">ID</th>
            <th className="border px-4 py-2">Name</th>
            <th className="border px-4 py-2">Role</th>
            <th className="border px-4 py-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user.id} className="text-center">
              <td className="border px-2 py-2">{user.id}</td>
              <td className="border px-2 py-2">{user.name}</td>
              <td className="border px-2 py-2">{user.role}</td>
              <td className="border px-2 py-2 flex flex-col md:flex-row justify-center gap-2">
                <button
                  onClick={() => handleUpdate(user.id)}
                  className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600 transition duration-200"
                >
                  Update
                </button>
                <button
                  onClick={() => handleDelete(user.id)}
                  className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 transition duration-200"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ManageUser;
