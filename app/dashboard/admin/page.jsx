'use client'; // Make sure this is placed at the top of the file
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function AdminDashboard() {
  const [adminData, setAdminData] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/account'); // Redirect to login page if not logged in
    } else {
      fetchAdminData(token); // Fetch admin data
    }
  }, []);

  const fetchAdminData = async (token) => {
    const response = await fetch("http://localhost:5000/api/admin", {
      headers: { "Authorization": `Bearer ${token}` },
    });
    const data = await response.json();
    setAdminData(data);
  };

  return (
    <section className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-lg mx-auto bg-white shadow-lg rounded-lg p-6">
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-6">Admin Dashboard</h2>
        <p className="text-lg text-gray-800">Welcome, {adminData ? adminData.username : 'loading...'}!</p>
        <div className="space-y-6 mt-6">
          <p className="text-gray-700">Email: {adminData ? adminData.email : 'loading...'}</p>
          <button
            className="py-2 px-4 bg-[#7FA15A] text-white rounded-lg hover:bg-green-900 transition-all duration-300"
            onClick={() => router.push('/admin/manage')}
          >
            Manage Users
          </button>
        </div>
      </div>
    </section>
  );
}
