"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import StyledAlert from '@/app/components/StyledAlert';
import axios from 'axios';

export default function UserDashboard() {
  const [user, setUser] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [loading, setLoading] = useState(true);
  const [alert, setAlert] = useState({ message: '', type: '', show: false });
  const [orders, setOrders] = useState([]);
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: ''
  });
  const router = useRouter();

  const showAlert = (message, type = 'info') => {
    setAlert({ message, type, show: true });
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch user data
        const userResponse = await axios.get('http://localhost:5000/api/user', {
          withCredentials: true
        });
        
        if (userResponse.data) {
          setUser(userResponse.data);
          setFormData({
            username: userResponse.data.username,
            email: userResponse.data.email,
            password: ''
          });
        }

        // Fetch orders
        const ordersResponse = await axios.get('http://localhost:5000/api/orders', {
          withCredentials: true
        });

        if (ordersResponse.data) {
          setOrders(ordersResponse.data);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
        if (error.response?.status === 401) {
          router.push('/login');
        } else {
          showAlert('Failed to load data. Please try again.', 'error');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [router]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    
    if (!formData.username.trim() || !formData.email.trim()) {
      showAlert('Username and email are required.', 'error');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      showAlert('Please enter a valid email address.', 'error');
      return;
    }

    if (formData.password.trim() && formData.password.trim().length < 6) {
      showAlert('Password must be at least 6 characters long.', 'error');
      return;
    }

    try {
      const updateData = {
        username: formData.username.trim(),
        email: formData.email.trim()
      };

      if (formData.password.trim()) {
        updateData.password = formData.password.trim();
      }

      const response = await axios.put('http://localhost:5000/api/user/update', updateData, {
        withCredentials: true
      });

      if (response.data) {
        setUser(response.data);
        setFormData({
          ...formData,
          password: ''
        });
        showAlert('Profile updated successfully!', 'success');
        setEditMode(false);
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      if (error.response?.data?.message) {
        showAlert(error.response.data.message, 'error');
      } else {
        showAlert('Failed to update profile. Please try again.', 'error');
      }
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#7FA15A]"></div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <section className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-6">User Dashboard</h2>
        
        {alert.show && (
          <StyledAlert
            message={alert.message}
            type={alert.type}
            onClose={() => setAlert({ ...alert, show: false })}
          />
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Profile Section */}
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-xl font-semibold mb-4">Profile Information</h3>
            {!editMode ? (
              <div className="space-y-2">
                <p className="text-lg font-semibold text-gray-800">{user.username}</p>
                <p className="text-gray-600">{user.email}</p>
                <button 
                  onClick={() => setEditMode(true)}
                  className="mt-4 py-2 px-6 bg-[#7FA15A] text-white rounded-lg hover:bg-[#607f4b] transition-colors"
                >
                  Edit Profile
                </button>
              </div>
            ) : (
              <form className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Username</label>
                  <input
                    type="text"
                    name="username"
                    value={formData.username}
                    onChange={handleChange}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#7FA15A] focus:border-transparent"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#7FA15A] focus:border-transparent"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">New Password (optional)</label>
                  <input
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#7FA15A] focus:border-transparent"
                    placeholder="Leave blank to keep current password"
                  />
                </div>

                <div className="flex space-x-4">
                  <button
                    onClick={handleUpdateProfile}
                    type="submit"
                    className="py-2 px-6 bg-[#7FA15A] text-white rounded-lg hover:bg-[#607f4b] transition-colors"
                  >
                    Save Changes
                  </button>
                  <button
                    onClick={() => {
                      setEditMode(false);
                      setFormData({
                        username: user.username,
                        email: user.email,
                        password: ''
                      });
                    }}
                    type="button"
                    className="py-2 px-6 bg-gray-400 text-white rounded-lg hover:bg-gray-500 transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            )}
          </div>

          {/* Orders Section */}
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-xl font-semibold mb-4">Your Orders</h3>
            {orders.length === 0 ? (
              <p className="text-gray-600">You haven't placed any orders yet.</p>
            ) : (
              <div className="space-y-4">
                {orders.map((order) => (
                  <div key={order._id} className="border rounded-lg p-4">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <p className="font-semibold">Order #{order._id.slice(-6)}</p>
                        <p className="text-sm text-gray-600">
                          {new Date(order.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                      <span className={`px-2 py-1 rounded-full text-sm ${
                        order.status === 'completed' ? 'bg-green-100 text-green-800' :
                        order.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                        order.status === 'processing' ? 'bg-blue-100 text-blue-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                      </span>
                    </div>
                    <div className="space-y-2">
                      {order.items.map((item, index) => (
                        <div key={index} className="flex items-center justify-between text-sm">
                          <div className="flex items-center space-x-3">
                            <img 
                              src={item.product.image} 
                              alt={item.product.name}
                              className="w-12 h-12 object-cover rounded-md"
                            />
                            <span>{item.product.name}</span>
                          </div>
                          <span>{item.quantity} x {item.price} DH</span>
                        </div>
                      ))}
                    </div>
                    <div className="mt-2 pt-2 border-t">
                      <p className="font-semibold text-right">
                        Total: {order.total.toFixed(2)} DH
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
