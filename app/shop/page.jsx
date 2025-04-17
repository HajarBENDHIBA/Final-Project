"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import axios from "axios";
import apiService from "@/src/services/api";

export default function Shop() {
  const [products, setProducts] = useState([]);
  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch products from the database
  const fetchProducts = async () => {
    try {
      const response = await apiService.client.get("/api/products");
      setProducts(response.data);
      setError(null);
    } catch (error) {
      console.error("Error fetching products:", error);
      setError("Failed to load products. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  // Load cart from localStorage on mount
  useEffect(() => {
    const storedCart = JSON.parse(localStorage.getItem("cart")) || [];
    setCart(storedCart);
  }, []);

  // Save cart to localStorage whenever cart is updated
  useEffect(() => {
    if (cart.length > 0) {
      localStorage.setItem("cart", JSON.stringify(cart));
    }
  }, [cart]);

  // Add product to the cart
  const addToCart = (product) => {
    const existingProduct = cart.find((item) => item._id === product._id);
    if (existingProduct) {
      const updatedCart = cart.map((item) =>
        item._id === product._id
          ? { ...item, quantity: item.quantity + 1 }
          : item
      );
      setCart(updatedCart);
    } else {
      setCart([...cart, { ...product, quantity: 1 }]);
    }
  };

  if (loading) {
    return <div className="p-8 text-center">Loading products...</div>;
  }

  if (error) {
    return (
      <div className="p-8 text-center">
        <p className="text-red-500 mb-4">{error}</p>
        <button
          onClick={fetchProducts}
          className="bg-[#7FA15A] text-white px-4 py-2 rounded hover:bg-green-900 transition"
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <section className="p-8 bg-gray-50 min-h-screen">
      <h2 className="text-4xl font-extrabold text-center text-[#7FA15A] mb-8">
        🌿 Our Shop
      </h2>
      <p className="text-center text-xl text-[#7FA15A] mb-10">
        Find the perfect plant for your home or office!
      </p>

      {products.length === 0 ? (
        <div className="text-center">
          <p className="text-gray-600">No products available at the moment.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
          {products.map((product) => (
            <div
              key={product._id}
              className="bg-white shadow-lg rounded-lg overflow-hidden transform hover:scale-105 transition duration-300"
            >
              <img
                src={product.image}
                alt={product.name}
                className="w-full h-130 object-cover transform hover:scale-110 transition duration-300"
              />
              <div className="p-5">
                <h3 className="text-2xl font-semibold text-[#7FA15A] pb-2 mb-4">
                  {product.name}
                </h3>
                <p className="text-gray-600 mt-2">{product.description}</p>
                <p className="text-[#82BE5A] font-bold mt-3">
                  {product.price} DH
                </p>
                <button
                  onClick={() => addToCart(product)}
                  className="mt-4 w-full bg-[#7FA15A] text-white py-2 rounded-lg hover:bg-green-900 transition"
                >
                  Add to Cart
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="mt-10 text-center">
        <Link href="/cart">
          <button className="bg-[#7FA15A] text-white px-6 py-3 rounded-lg hover:bg-green-900 transition">
            Go to Cart ({cart.length})
          </button>
        </Link>
      </div>

      {/* Call to Action */}
      <section className="bg-gray-50 py-20">
        <div className="container mx-auto px-6 text-center">
          <div className="max-w-2xl mx-auto bg-white shadow-lg rounded-lg p-8">
            <h2 className="text-4xl font-bold text-[#7FA15A] mb-12">
              Get to Know Your Plant
            </h2>
            <p className="text-gray-700 text-xl">
              Curious about your leafy friend? Tap below to explore care tips,
              fun facts, and all you need to help your plant flourish!
            </p>
            <a
              href="/blog"
              className="mt-8 inline-block bg-[#7FA15A] text-white font-semibold text-lg px-8 py-4 rounded-full shadow-md hover:bg-[#6b944e] transition duration-300"
            >
              Explore Our Blog
            </a>
          </div>
        </div>
      </section>
    </section>
  );
}
