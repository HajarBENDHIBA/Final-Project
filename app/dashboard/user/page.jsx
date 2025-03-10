'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function UserDashboard() {
  const [user, setUser] = useState(null);
  const [orders, setOrders] = useState([]);
  const [error, setError] = useState('');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [editMode, setEditMode] = useState(false);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push('/login');
      return;
    }

    const fetchData = async () => {
      try {
        const userRes = await fetch("http://localhost:5000/api/user", {
          method: "GET",
          credentials: "include",
          headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });

        if (!userRes.ok) throw new Error("Failed to fetch user data");
        const userData = await userRes.json();
        setUser(userData);
        setUsername(userData.username);
        setEmail(userData.email);

        const ordersRes = await fetch("http://localhost:5000/api/orders/user", {
          method: "GET",
          credentials: "include",
          headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });

        if (!ordersRes.ok) throw new Error("Failed to fetch orders");
        const ordersData = await ordersRes.json();
        console.log(ordersData); // Debugging orders
        setOrders(ordersData);
      } catch (err) {
        setError(err.message || "Error fetching data");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [router]);

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setError("");
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        setError("Unauthorized");
        return;
      }

      const response = await fetch("http://localhost:5000/api/user/update", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify({ username, email, password }),
        credentials: "include",
      });

      if (!response.ok) {
        throw new Error("Failed to update profile");
      }

      alert("Profile updated successfully!");
      setEditMode(false);
    } catch (err) {
      setError(err.message || "Something went wrong");
    }
  };

  if (loading) return <p className="text-center text-gray-500">Loading...</p>;

  return (
    <section className="min-h-screen bg-gray-50 p-8 flex justify-center">
      <div className="w-full max-w-4xl bg-white shadow-lg rounded-lg p-8">
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-6">User Dashboard</h2>
        {error && <p className="text-red-500 text-center">{error}</p>}

        <div className="flex flex-col items-center mb-8">
          {!editMode ? (
            <div className="text-center space-y-2">
              <p className="text-lg font-semibold text-gray-800">{username}</p>
              <p className="text-gray-600">{email}</p>
              <button onClick={() => setEditMode(true)} className="mt-4 py-2 px-6 bg-green-600 text-white rounded-lg hover:bg-green-800">
                Edit Profile
              </button>
            </div>
          ) : (
            <form onSubmit={handleUpdateProfile} className="w-full space-y-4 border p-4 rounded-lg">
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg"
                placeholder="Username"
              />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg"
                placeholder="Email"
              />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg"
                placeholder="New Password"
              />
              <div className="flex space-x-4">
                <button type="submit" className="py-2 px-6 bg-green-600 text-white rounded-lg hover:bg-green-800">
                  Update
                </button>
                <button type="button" onClick={() => setEditMode(false)} className="py-2 px-6 bg-gray-400 text-white rounded-lg hover:bg-gray-600">
                  Cancel
                </button>
              </div>
            </form>
          )}
        </div>

        <div className="mt-8">
          <h3 className="text-xl font-semibold text-gray-800 mb-4">Your Orders</h3>
          {orders.length > 0 ? (
            <ul className="space-y-4">
              {orders.map((order) => (
                <li key={order._id} className="p-4 border rounded-lg shadow-sm">
                  <p className="text-gray-700 font-semibold">Order ID: {order._id}</p>
                  <p className="text-gray-600">Total: {order.totalPrice} DH</p>
                  <p className="text-gray-600">Status: {order.orderStatus}</p>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-500">You have no orders yet.</p>
          )}
        </div>
      </div>
    </section>
  );
}
