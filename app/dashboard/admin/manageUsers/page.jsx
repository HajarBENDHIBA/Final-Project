'use client';

import { useState, useEffect } from 'react';
import { TrashIcon } from '@heroicons/react/24/outline';
import StyledAlert from '@/app/components/StyledAlert';
import axios from 'axios';

export default function ManageUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [alert, setAlert] = useState({ message: '', type: '', show: false });

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/users'); // Adjust API endpoint if needed
        const data = await response.json();
        setUsers(data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching users:', error);
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  const showAlert = (message, type = 'info') => {
    setAlert({ message, type, show: true });
  };

  const handleDeleteUser = async (id) => {
    try {
      const response = await axios.delete(`http://localhost:5000/api/users/${id}`, {
        withCredentials: true
      });

      if (response.data) {
        setUsers(users.filter(user => user._id !== id));
        showAlert("User deleted successfully.", "success");
      }
    } catch (error) {
      console.error('Error deleting user:', error);
      if (error.response) {
        showAlert("Failed to delete user.", "error");
      } else {
        showAlert("An error occurred while deleting the user.", "error");
      }
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <section className="p-8 bg-gray-50 min-h-screen">
      <h2 className="text-4xl font-extrabold text-center text-[#7FA15A] mb-8">👤 Manage Users</h2>
      <p className="text-center text-lg text-[#7FA15A] mb-6">Manage your platform users below</p>

      {alert.show && (
        <StyledAlert
          message={alert.message}
          type={alert.type}
          onClose={() => setAlert({ ...alert, show: false })}
        />
      )}

      {users.length === 0 ? (
        <div className="flex flex-col items-center justify-center">
          <p className="text-center text-gray-600 text-lg">No users available.</p>
        </div>
      ) : (
        <div className="max-w-4xl mx-auto bg-white shadow-lg rounded-lg p-6 space-y-4">
          {users.map((user) => (
            <div key={user._id} className="flex items-center justify-between border-b py-4">
              <div className="flex items-center space-x-4">
                <div>
                  <h3 className="text-xl font-semibold text-[#7FA15A]">{user.username}</h3>
                  <p className="text-gray-600">{user.email}</p>
                </div>
              </div>

              <div className="flex items-center justify-center space-x-4 ml-auto">
              <button 
  onClick={() => handleDeleteUser(user._id)} 
  className="p-2 text-red-600 hover:text-red-800 transition"
  title="Delete"
>
  <TrashIcon className="h-5 w-5" />
</button>

              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
