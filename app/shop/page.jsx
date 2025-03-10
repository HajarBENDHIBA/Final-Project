'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';

const plants = [
  { id: 1, name: 'Monstera Deliciosa', description: 'A tropical beauty with large, split leaves.', image: '/plants/monstera.jpg', price: 360 },
  { id: 2, name: 'Snake Plant', description: 'Low-maintenance and air-purifying.', image: '/plants/snake-plant.jpg', price: 80 },
  { id: 3, name: 'Fiddle Leaf Fig', description: 'Elegant and perfect for indoors.', image: '/plants/fiddle-leaf.jpg', price: 130 },
  { id: 4, name: 'Peace Lily', description: 'Brings peace and purifies air.', image: '/plants/peace-lily.jpg', price: 150 },
  { id: 5, name: 'Aloe Vera', description: 'Soothing and easy to care for.', image: '/plants/aloe-vera.jpg', price: 110 },
  { id: 6, name: 'Spider Plant', description: 'Hardy and great for beginners.', image: '/plants/spider-plant.jpg', price: 50 },
  { id: 7, name: 'ZZ Plant', description: 'Thrives in low light conditions.', image: '/plants/zz-plant.jpg', price: 160 },
  { id: 8, name: 'Areca Palm', description: 'A graceful palm with feathery green fronds.', image: '/plants/areca-palm.jpg', price: 450 },
  { id: 9, name: 'Rubber Plant', description: 'Deep green glossy leaves.', image: '/plants/rubber-plant.jpg', price: 280 },
  { id: 10, name: 'Calathea', description: 'Unique leaf patterns.', image: '/plants/calathea.jpg', price: 90 },
  { id: 11, name: 'Cactus', description: 'Drought-resistant and stylish.', image: '/plants/cactus.jpg', price: 40 },
  { id: 12, name: 'Pothos', description: 'Fast-growing and beautiful vines.', image: '/plants/pothos.jpg', price: 170 },
];

export default function Shop() {
  const [cart, setCart] = useState([]);

  // Load cart from localStorage on mount
  useEffect(() => {
    const storedCart = JSON.parse(localStorage.getItem('cart')) || [];
    setCart(storedCart);
  }, []);

  // Save cart to localStorage whenever cart is updated
  useEffect(() => {
    if (cart.length > 0) {
      localStorage.setItem('cart', JSON.stringify(cart));
    }
  }, [cart]);

  // Add product to the cart
  const addToCart = (plant) => {
    const existingPlant = cart.find((item) => item.id === plant.id);
    if (existingPlant) {
      const updatedCart = cart.map((item) =>
        item.id === plant.id ? { ...item, quantity: item.quantity + 1 } : item
      );
      setCart(updatedCart);
    } else {
      setCart([...cart, { ...plant, quantity: 1 }]);
    }
  };

  return (
    <section className="p-8 bg-gray-50 min-h-screen">
      <h2 className="text-4xl font-extrabold text-center text-[#7FA15A] mb-8">🌿 Our Shop</h2>
      <p className="text-center text-lg text-[#7FA15A] mb-10">Find the perfect plant for your home or office!</p>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
        {plants.map((plant) => (
          <div
            key={plant.id}
            className="bg-white shadow-lg rounded-lg overflow-hidden transform hover:scale-105 transition duration-300"
          >
            <img
              src={plant.image}
              alt={plant.name}
              className="w-full h-130 object-cover transform hover:scale-110 transition duration-300"
            />
            <div className="p-5">
              <h3 className="text-2xl font-semibold text-[#7FA15A] pb-2 mb-4">
                {plant.name}
              </h3>
              <p className="text-gray-600 mt-2">{plant.description}</p>
              <p className="text-[#82BE5A] font-bold mt-3">{plant.price} DH</p>
              <button
                onClick={() => addToCart(plant)}
                className="mt-4 w-full bg-[#7FA15A] text-white py-2 rounded-lg hover:bg-green-900 transition"
              >
                Add to Cart
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-10 text-center">
        <Link href="/cart">
          <button className="bg-[#7FA15A] text-white px-6 py-3 rounded-lg hover:bg-green-900 transition">
            Go to Cart ({cart.length})
          </button>
        </Link>
      </div>
    </section>
  );
}
