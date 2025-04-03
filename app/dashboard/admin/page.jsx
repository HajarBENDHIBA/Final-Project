"use client";

import { useEffect, useState } from "react";
import StyledAlert from '@/app/components/StyledAlert';

export default function AdminDashboard() {
    const [admin, setAdmin] = useState(null);
    const [formData, setFormData] = useState({ name: "", email: "", password: "" });
    const [editing, setEditing] = useState(false);
    const [alert, setAlert] = useState({ message: '', type: '', show: false });

    useEffect(() => {
        fetchAdmin();
    }, []);

    const fetchAdmin = async () => {
        try {
            const res = await fetch("http://localhost:5000/api/admin", { credentials: "include" });
            const data = await res.json();
            setAdmin(data);
            setFormData({ username: data.username, email: data.email, password: "" });
        } catch (error) {
            console.error("Error fetching admin:", error);
        }
    };

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const showAlert = (message, type = 'info') => {
        setAlert({ message, type, show: true });
    };

    const handleUpdate = async () => {
        try {
            const res = await fetch("http://localhost:5000/api/admin", {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData),
                credentials: "include",
            });

            if (!res.ok) throw new Error("Failed to update profile");
            showAlert("Profile updated!", "success");
            setEditing(false);
            fetchAdmin();
        } catch (error) {
            console.error("Update error:", error);
            showAlert("Failed to update profile. Please try again.", "error");
        }
    };

    if (!admin) return <p>Loading...</p>;

    return (
        <section className="min-h-screen bg-gray-50 p-8 flex justify-center">
            <div className="w-full max-w-2xl bg-white shadow-lg rounded-lg p-8 h-[500px]">
                <h2 className="text-3xl font-bold text-center text-gray-800 mb-6">Admin Dashboard</h2>
                {alert.show && (
                    <StyledAlert
                        message={alert.message}
                        type={alert.type}
                        onClose={() => setAlert({ ...alert, show: false })}
                    />
                )}
                <div className="flex flex-col items-center mb-8">
                    {!editing ? (
                        <div className="text-center space-y-2">
                            <p className="text-lg font-semibold text-gray-800">{admin.username}</p>
                            <p className="text-gray-600">{admin.email}</p>
                            <button onClick={() => setEditing(true)} className="mt-4 py-2 px-6 bg-green-600 text-white rounded-lg hover:bg-green-800">
                                Edit Profile
                            </button>
                        </div>
                    ) : (
                        <form className="w-full space-y-4 border p-4 rounded-lg">
                            <input
                                type="text"
                                name="username"
                                value={formData.username}
                                onChange={handleChange}
                                className="w-full p-3 border border-gray-300 rounded-lg"
                                placeholder="Username"
                            />
                            <input
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                className="w-full p-3 border border-gray-300 rounded-lg"
                                placeholder="Email"
                            />
                            <input
                                type="password"
                                name="password"
                                placeholder="New password (optional)"
                                onChange={handleChange}
                                className="w-full p-3 border border-gray-300 rounded-lg"
                            />
                            <div className="flex space-x-4">
                                <button onClick={handleUpdate} type="button" className="py-2 px-6 bg-green-600 text-white rounded-lg hover:bg-green-800">
                                    Save
                                </button>
                                <button onClick={() => setEditing(false)} type="button" className="py-2 px-6 bg-gray-400 text-white rounded-lg hover:bg-gray-600">
                                    Cancel
                                </button>
                            </div>
                        </form>
                    )}
                </div>
            </div>
        </section>
    );
}