"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import StyledAlert from "@/app/components/StyledAlert";
import axios from "axios";
import { TrashIcon } from "@heroicons/react/24/outline";

export default function UserDashboard() {
  const [user, setUser] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [loading, setLoading] = useState(true);
  const [alert, setAlert] = useState({ message: "", type: "", show: false });
  const [orders, setOrders] = useState([]);
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
  });
  const router = useRouter();

  const showAlert = (message, type = "info") => {
    setAlert({ message, type, show: true });
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch user data
        const userResponse = await axios.get(
          "https://backend-green-heaven-git-main-hajar-bendhibas-projects.vercel.app/api/user",
          {
            withCredentials: true,
          }
        );

        if (userResponse.data) {
          setUser(userResponse.data);
          setFormData({
            username: userResponse.data.username,
            email: userResponse.data.email,
            password: "",
          });
        }

        // Fetch orders
        const ordersResponse = await axios.get(
          "https://backend-green-heaven-git-main-hajar-bendhibas-projects.vercel.app/api/orders",
          {
            withCredentials: true,
          }
        );

        if (ordersResponse.data) {
          setOrders(ordersResponse.data);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
        if (error.response?.status === 401) {
          router.push("/login");
        } else {
          showAlert("Failed to load data. Please try again.", "error");
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
      [e.target.name]: e.target.value,
    });
  };

  const handleUpdateProfile = async (e) => {
    e.preventDefault();

    if (!formData.username.trim() || !formData.email.trim()) {
      showAlert("Username and email are required.", "error");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      showAlert("Please enter a valid email address.", "error");
      return;
    }

    if (formData.password.trim() && formData.password.trim().length < 6) {
      showAlert("Password must be at least 6 characters long.", "error");
      return;
    }

    try {
      const updateData = {
        username: formData.username.trim(),
        email: formData.email.trim(),
      };

      if (formData.password.trim()) {
        updateData.password = formData.password.trim();
      }

      const response = await axios.put(
        "https://backend-green-heaven-git-main-hajar-bendhibas-projects.vercel.app/api/user/update",
        updateData,
        {
          withCredentials: true,
        }
      );

      if (response.data) {
        setUser(response.data);
        setFormData({
          ...formData,
          password: "",
        });
        showAlert("Profile updated successfully!", "success");
        setEditMode(false);
      }
    } catch (error) {
      console.error("Error updating profile:", error);
      if (error.response?.data?.message) {
        showAlert(error.response.data.message, "error");
      } else {
        showAlert("Failed to update profile. Please try again.", "error");
      }
    }
  };

  const handleDeleteOrder = async (orderId) => {
    if (
      !window.confirm(
        "Are you sure you want to delete this order? This action cannot be undone."
      )
    ) {
      return;
    }

    try {
      const response = await axios.delete(
        `https://backend-green-heaven-git-main-hajar-bendhibas-projects.vercel.app/api/orders/${orderId}`,
        {
          withCredentials: true,
        }
      );

      if (response.data) {
        // Update the orders list
        setOrders(orders.filter((order) => order._id !== orderId));
        showAlert("Order deleted successfully!", "success");
      }
    } catch (error) {
      console.error("Error deleting order:", error);
      if (error.response?.status === 404) {
        showAlert("Order not found or already deleted.", "error");
      } else {
        showAlert("Failed to delete order. Please try again.", "error");
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
      <div className="max-w-2xl mx-auto">
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-6">
          User Dashboard
        </h2>

        <div className="text-center mb-8">
          <a
            href={`https://wa.me/212762752337?text=${encodeURIComponent(`Hello! I would like to confirm my order from Green Heaven.

Order Details:
${orders
  .map(
    (order) => `
Order #${order._id.slice(-6)}
Items:
${order.items
  .map(
    (item) =>
      `- ${item.product?.name || "Product Unavailable"} (${item.quantity}x) - ${
        item.price
      } DH`
  )
  .join("\n")}
Order Total: ${order.items
      .reduce((sum, item) => sum + item.price * item.quantity, 0)
      .toFixed(2)} DH
`
  )
  .join("\n")}

Customer Information:
Name: ${user.username}
Email: ${user.email}

Thank you!`)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center px-6 py-3 bg-[#25D366] text-white rounded-lg hover:bg-[#128C7E] transition-colors"
          >
            <svg
              className="w-6 h-6 mr-2"
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.27 1.019 3.287l-.582 2.128 2.182-.573c.978.58 1.911.928 3.145.929 3.178 0 5.767-2.587 5.768-5.766.001-3.187-2.575-5.771-5.764-5.771zm3.392 8.244c-.144.405-.837.774-1.17.824-.299.045-.677.063-1.092-.069-.252-.08-.575-.187-.988-.365-1.739-.751-2.874-2.502-2.961-2.617-.087-.116-.708-.94-.708-1.793s.448-1.273.607-1.446c.159-.173.346-.217.462-.217l.332.006c.106.005.249-.04.39.298.144.347.491 1.2.534 1.287.043.087.072.188.014.304-.058.116-.087.188-.173.289l-.26.304c-.087.086-.177.18-.076.354.101.174.449.741.964 1.201.662.591 1.221.774 1.394.86s.274.072.376-.043c.101-.116.433-.506.549-.68.116-.173.231-.145.39-.087s1.011.477 1.184.564c.173.087.287.129.332.202.045.073.045.419-.1.824zm-3.423-14.416c-6.627 0-12 5.373-12 12s5.373 12 12 12 12-5.373 12-12-5.373-12-12-12zm.029 18.88c-1.161 0-2.305-.292-3.318-.844l-3.677.964.984-3.595c-.607-1.052-.927-2.246-.926-3.468.001-3.825 3.113-6.937 6.937-6.937 1.856.001 3.598.723 4.907 2.034 1.31 1.311 2.031 3.054 2.03 4.908-.001 3.825-3.113 6.938-6.937 6.938z" />
            </svg>
            Confirm Order on WhatsApp
          </a>
        </div>

        {alert.show && (
          <StyledAlert
            message={alert.message}
            type={alert.type}
            onClose={() => setAlert({ ...alert, show: false })}
          />
        )}

        <div className="flex flex-col gap-8">
          {/* Profile Section */}
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-xl font-semibold mb-4">Profile Information</h3>
            {!editMode ? (
              <div className="space-y-2">
                <p className="text-lg font-semibold text-gray-800">
                  {user.username}
                </p>
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
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Username
                  </label>
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
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Email
                  </label>
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
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    New Password (optional)
                  </label>
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
                    Save
                  </button>
                  <button
                    onClick={() => {
                      setEditMode(false);
                      setFormData({
                        username: user.username,
                        email: user.email,
                        password: "",
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
              <div className="flex flex-col items-center justify-center">
                <img
                  src="/empty-cart1.png"
                  alt="No Orders"
                  className="w-60 h-auto mb-4 opacity-80"
                />
                <p className="text-gray-600">
                  You haven't placed any orders yet.
                </p>
              </div>
            ) : (
              <>
                <div className="bg-[#7FA15A] text-white p-4 rounded-lg mb-6">
                  <h4 className="text-lg font-semibold mb-2">Order Summary</h4>
                  <p className="text-xl">Total Orders: {orders.length}</p>
                  <p className="text-2xl font-bold">
                    Total Amount:{" "}
                    {orders
                      .reduce((sum, order) => {
                        const orderTotal = order.items.reduce(
                          (itemSum, item) => {
                            return itemSum + item.price * item.quantity;
                          },
                          0
                        );
                        return sum + orderTotal;
                      }, 0)
                      .toFixed(2)}{" "}
                    DH
                  </p>
                </div>
                <div className="space-y-4">
                  {orders.map((order) => (
                    <div
                      key={order._id}
                      className="bg-white rounded-lg shadow-md p-6 mb-6"
                    >
                      <div className="flex justify-between items-center mb-4">
                        <h3 className="text-lg font-semibold">
                          Order #{order._id.slice(-6)}
                        </h3>
                        <span
                          className={`px-3 py-1 rounded-full text-sm ${
                            order.status === "pending"
                              ? "bg-yellow-100 text-yellow-800"
                              : order.status === "processing"
                              ? "bg-blue-100 text-blue-800"
                              : order.status === "shipped"
                              ? "bg-purple-100 text-purple-800"
                              : "bg-green-100 text-green-800"
                          }`}
                        >
                          {order.status.charAt(0).toUpperCase() +
                            order.status.slice(1)}
                        </span>
                      </div>
                      <div className="space-y-4">
                        {order.items.map((item) => (
                          <div
                            key={item._id}
                            className="flex items-center space-x-4"
                          >
                            {item.product && item.product.image && (
                              <img
                                src={item.product.image}
                                alt={item.product.name}
                                className="w-16 h-16 object-cover rounded"
                              />
                            )}
                            <div className="flex-1">
                              <h4 className="font-medium">
                                {item.product?.name || "Product Unavailable"}
                              </h4>
                              <p className="text-gray-600">
                                Quantity: {item.quantity}
                              </p>
                              <p className="text-gray-600">
                                Price: {item.price} DH
                              </p>
                              <p className="text-gray-600">
                                Subtotal:{" "}
                                {(item.price * item.quantity).toFixed(2)} DH
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                      <div className="mt-4 pt-4 border-t">
                        <div className="flex justify-between items-center">
                          <p className="text-right font-semibold text-lg">
                            Order Total:{" "}
                            {order.items
                              .reduce((sum, item) => {
                                return sum + item.price * item.quantity;
                              }, 0)
                              .toFixed(2)}{" "}
                            DH
                          </p>
                          <button
                            onClick={() => handleDeleteOrder(order._id)}
                            className="p-2 text-red-600 hover:text-red-800 transition"
                            title="Delete Order"
                          >
                            <TrashIcon className="h-5 w-5" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
