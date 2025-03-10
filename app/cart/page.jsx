'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { TrashIcon } from '@heroicons/react/24/outline';

export default function Cart() {
  const [cartItems, setCartItems] = useState([]);

  useEffect(() => {
    const storedCart = JSON.parse(localStorage.getItem('cart')) || [];
    const updatedCart = storedCart.map(item => ({
      ...item,
      quantity: item.quantity || 1,
    }));
    setCartItems(updatedCart);
  }, []);

  const removeFromCart = (id) => {
    const updatedCart = cartItems.filter(item => item.id !== id);
    setCartItems(updatedCart);
    localStorage.setItem('cart', JSON.stringify(updatedCart));
  };

  const updateQuantity = (id, newQuantity) => {
    if (newQuantity < 1) return;
    const updatedCart = cartItems.map(item =>
      item.id === id ? { ...item, quantity: newQuantity } : item
    );
    setCartItems(updatedCart);
    localStorage.setItem('cart', JSON.stringify(updatedCart));
  };

  const getMaxQuantity = (id) => {
    const item = cartItems.find(item => item.id === id);
    return item ? item.stock : 10;
  };

  const totalPrice = cartItems.reduce((total, item) => total + item.price * item.quantity, 0).toFixed(2);

  const proceedToCheckout = async () => {
    const token = localStorage.getItem("token");  // Get the user's token
    if (!token) {
      alert("Please log in to proceed with checkout.");
      return;
    }
    if (isTokenExpired(token)) {
      alert("Your session has expired. Please log in again.");
      localStorage.removeItem("token");  // Remove expired token
      window.location.href = "/login";  // Redirect to login page
      return;
    }
  
    const order = {
      products: cartItems,
      totalPrice: totalPrice,
      paymentDetails: { /* Your payment details here */ },
    };
  
    try {
      const response = await fetch("http://localhost:5000/api/orders", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,  // Ensure the token is sent
        },
        body: JSON.stringify(order),
        credentials: "include",
      });
  
      if (response.ok) {
        localStorage.removeItem("cart");
        setCartItems([]);
        window.location.href = "/dashboard/user";
      } else {
        const errorData = await response.json();
        alert(errorData.message || "Failed to place order. Try again.");
      }
    } catch (error) {
      console.error("Error placing order:", error);
      alert("An error occurred while placing the order.");
    }
  };
  

  return (
    <section className="p-8 bg-gray-50 min-h-screen">
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

              <div className="flex items-center justify-center space-x-4 ml-auto">
                <button 
                  onClick={() => updateQuantity(item.id, item.quantity - 1)} 
                  className="bg-[#7FA15A] text-white px-2 py-1 rounded-md hover:bg-[#607f4b]">
                  -
                </button>
                <span className="text-lg">{item.quantity}</span>
                <button 
                  onClick={() => updateQuantity(item.id, item.quantity + 1)} 
                  className="bg-[#7FA15A] text-white px-2 py-1 rounded-md hover:bg-[#607f4b]">
                  +
                </button>

                <button onClick={() => removeFromCart(item.id)}>
                  <TrashIcon className="h-5 w-5 text-red-600 cursor-pointer hover:text-red-700" />
                </button>
              </div>
            </div>
          ))}

          <div className="flex items-center justify-between py-4">
            <p className="text-xl font-bold">Total: {totalPrice} DH</p>
            <button
              onClick={proceedToCheckout}
              className="bg-[#7FA15A] text-white py-2 px-6 rounded-md hover:bg-[#607f4b] transition-all">
              Proceed to Checkout
            </button>
          </div>
        </div>
      )}
    </section>
  );
}
