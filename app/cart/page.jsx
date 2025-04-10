'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { TrashIcon } from '@heroicons/react/24/outline';
import StyledAlert from '@/app/components/StyledAlert';
import axios from 'axios';

export default function Cart() {
  const [cartItems, setCartItems] = useState([]);
  const [alert, setAlert] = useState({ message: '', type: '', show: false });

  useEffect(() => {
    const storedCart = JSON.parse(localStorage.getItem('cart')) || [];
    const updatedCart = storedCart.map(item => ({
      ...item,
      quantity: item.quantity || 1,
    }));
    setCartItems(updatedCart);
  }, []);

  const removeFromCart = (id) => {
    const updatedCart = cartItems.filter(item => item._id !== id);
    setCartItems(updatedCart);
    localStorage.setItem('cart', JSON.stringify(updatedCart));
  };

  const updateQuantity = (id, newQuantity) => {
    if (newQuantity < 1) return;
    const updatedCart = cartItems.map(item => {
      if (item._id === id) {
        return { ...item, quantity: newQuantity };
      }
      return item;
    });
    setCartItems(updatedCart);
    localStorage.setItem('cart', JSON.stringify(updatedCart));
  };

  const getMaxQuantity = (id) => {
    const item = cartItems.find(item => item._id === id);
    return item ? item.stock : 10;
  };

  const totalPrice = cartItems.reduce((total, item) => total + item.price * item.quantity, 0).toFixed(2);

  const showAlert = (message, type = 'info') => {
    setAlert({ message, type, show: true });
  };

  const handleCheckout = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/user', {
        withCredentials: true
      });

      if (!response.data) {
        showAlert("Please log in to proceed with checkout.", "warning");
        return;
      }

      // ... rest of the checkout logic ...

    } catch (error) {
      if (error.response && error.response.status === 401) {
        showAlert("Your session has expired. Please log in again.", "error");
      } else {
        console.error('Error during checkout:', error);
        showAlert("An error occurred during checkout. Please try again.", "error");
      }
    }
  };

  const handlePlaceOrder = async () => {
    try {
      // Check if user is logged in
      const userResponse = await axios.get('http://localhost:5000/api/user', {
        withCredentials: true
      });

      if (!userResponse.data) {
        showAlert("Please log in to place an order.", "warning");
        return;
      }

      // Check if user is an admin
      if (userResponse.data.role === 'admin') {
        showAlert("Admins are not allowed to place orders.", "error");
        return;
      }

      // Prepare order data
      const orderData = {
        items: cartItems.map(item => ({
          id: item._id,
          quantity: item.quantity,
          price: item.price
        })),
        total: cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0)
      };

      // Place the order
      const response = await axios.post('http://localhost:5000/api/orders', orderData, {
        withCredentials: true
      });

      if (response.data) {
        // Clear the cart
        setCartItems([]);
        localStorage.removeItem('cart');
        
        showAlert("Order placed successfully!", "success");
        
        // Redirect to orders page or home page after a delay
        setTimeout(() => {
          window.location.href = '/dashboard/user';
        }, 2000);
      }
    } catch (error) {
      console.error('Error placing order:', error);
      if (error.response) {
        const errorData = error.response.data;
        showAlert(errorData.message || "Failed to place order. Try again.", "error");
      } else {
        showAlert("An error occurred while placing the order.", "error");
      }
    }
  };

  return (
    <section className="p-8 bg-gray-50 min-h-screen">
      {alert.show && (
        <StyledAlert
          message={alert.message}
          type={alert.type}
          onClose={() => setAlert({ ...alert, show: false })}
        />
      )}
      <h2 className="text-4xl font-extrabold text-center text-[#7FA15A] mb-8">🛒 Your Cart</h2>
      <p className="text-center text-lg text-[#7FA15A] mb-6">Manage your selected plants below</p>

      {cartItems.length === 0 ? (
        <div className="flex flex-col items-center justify-center">
          <img src="/empty-cart1.png" alt="Empty Cart" className="w-60 h-auto mb-4 opacity-80" />
          <p className="text-center text-gray-600 text-lg">
            Your cart is empty. 
            <Link href="/shop" className="text-[#7FA15A] underline ml-1">Continue Shopping</Link>
          </p>
        </div>
      ) : (
        <div className="max-w-4xl mx-auto bg-white shadow-lg rounded-lg p-6 space-y-4">
          {cartItems.map((item) => (
            <div key={item.id} className="flex items-center justify-between border-b py-4">
              <div className="flex items-center space-x-4">
                <img src={item.image} alt={item.name} className="w-16 h-16 rounded-lg object-cover" />
                <div>
                  <h3 className="text-xl font-semibold text-[#7FA15A]">{item.name}</h3>
                  <p className="text-gray-600">{item.price} DH</p>
                </div>
              </div>

              <div className="flex items-center space-x-4 ml-auto">
                <button 
                  onClick={() => updateQuantity(item._id, item.quantity - 1)} 
                  className="bg-[#7FA15A] text-white px-2 py-1 rounded-md hover:bg-[#607f4b]">
                  -
                </button>
                <span className="text-lg">{item.quantity}</span>
                <button 
                  onClick={() => updateQuantity(item._id, item.quantity + 1)} 
                  className="bg-[#7FA15A] text-white px-2 py-1 rounded-md hover:bg-[#607f4b]">
                  +
                </button>

                <button onClick={() => removeFromCart(item._id)}>
                  <TrashIcon className="h-5 w-5 text-red-600 cursor-pointer hover:text-red-700" />
                </button>
              </div>
            </div>
          ))}

          <div className="flex items-center justify-between py-4">
            <p className="text-xl font-bold">Total: {totalPrice} DH</p>
            <button
              onClick={handlePlaceOrder}
              className="bg-[#7FA15A] text-white py-2 px-6 rounded-md hover:bg-[#607f4b] transition-all">
              Proceed to Checkout
            </button>
          </div>
        </div>
      )}
    </section>
  );
}
