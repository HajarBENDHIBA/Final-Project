'use client';

import React, { useState, useEffect } from 'react';
import axios from 'axios';

export default function ManageProducts() {
  const [productList, setProductList] = useState([]);
  const [newProduct, setNewProduct] = useState({ name: '', description: '', price: '', image: null });
  const [loading, setLoading] = useState(true);

  // Fetch products from the database
  const fetchProducts = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/products');
      setProductList(response.data);
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/products/${id}`);
      // Update the local state after successful deletion
      setProductList(productList.filter((product) => product._id !== id));
    } catch (error) {
      console.error('Error deleting product:', error);
      alert('Failed to delete product. Please try again.');
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setNewProduct({ ...newProduct, image: reader.result });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAddProduct = async (e) => {
    e.preventDefault();

    // Validate price to ensure it's a positive number
    if (isNaN(newProduct.price) || newProduct.price <= 0) {
      alert('Please enter a valid price.');
      return;
    }

    // Validate image
    if (!newProduct.image) {
      alert('Please select an image.');
      return;
    }

    try {
      // Prepare the product data
      const productData = {
        name: newProduct.name.trim(),
        description: newProduct.description.trim(),
        price: parseFloat(newProduct.price),
        image: newProduct.image
      };

      // Make API call to add the product
      const response = await axios.post('http://localhost:5000/api/products', productData);

      if (response.data) {
        // Add the product to the list with the ID from the database
        setProductList([...productList, response.data]);

    // Reset the form
        setNewProduct({ name: '', description: '', price: '', image: null });
        
        alert('Product added successfully!');
      }
    } catch (error) {
      console.error('Error adding product:', error);
      if (error.response) {
        console.error('Server response:', error.response.data);
        const errorMessage = error.response.data.error || error.response.data.message || 'Unknown error';
        alert(`Failed to add product: ${errorMessage}`);
      } else if (error.request) {
        console.error('No response received:', error.request);
        alert('Failed to add product: No response from server. Please check if the server is running.');
      } else {
        console.error('Error setting up request:', error.message);
        alert('Failed to add product: ' + error.message);
      }
    }
  };

  if (loading) {
    return <div className="p-8 text-center">Loading products...</div>;
  }

  return (
    <div className="p-8 bg-gray-100 min-h-screen">
      <h1 className="text-3xl font-bold text-[#7FA15A] mb-6">Manage Products</h1>

      {/* Add Product Form */}
      <div className="bg-white shadow-md rounded-lg p-6 mb-6">
        <h2 className="text-2xl font-semibold text-[#7FA15A] mb-4">Add New Product</h2>
        <form onSubmit={handleAddProduct} className="space-y-4">
          <input
            type="text"
            placeholder="Product Name"
            value={newProduct.name}
            onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
            className="w-full px-4 py-2 border border-gray-300 rounded"
            required
          />
          <input
            type="text"
            placeholder="Product Description"
            value={newProduct.description}
            onChange={(e) => setNewProduct({ ...newProduct, description: e.target.value })}
            className="w-full px-4 py-2 border border-gray-300 rounded"
            required
          />
          <input
            type="number"
            placeholder="Price (DH)"
            value={newProduct.price}
            onChange={(e) => setNewProduct({ ...newProduct, price: e.target.value })}
            className="w-full px-4 py-2 border border-gray-300 rounded"
            required
          />
          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            className="w-full px-4 py-2 border border-gray-300 rounded"
            required
          />
          {newProduct.image && (
            <div className="mt-2">
              <img 
                src={newProduct.image} 
                alt="Preview" 
                className="w-32 h-32 object-cover rounded"
              />
            </div>
          )}
          <button
            type="submit"
            className="w-full bg-[#7FA15A] text-white py-2 rounded hover:bg-[#6a8c4f] transition"
          >
            Add Product
          </button>
        </form>
      </div>

      {/* Product Table */}
      <div className="bg-white shadow-md rounded-lg p-6 overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-[#7FA15A] text-white">
              <th className="py-3 px-6 text-left">Image</th>
              <th className="py-3 px-6 text-left">Product Name</th>
              <th className="py-3 px-6 text-left">Description</th>
              <th className="py-3 px-6 text-left">Price (DH)</th>
              <th className="py-3 px-6 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {productList.map((product) => (
              <tr key={product._id} className="border-b">
                <td className="py-3 px-6">
                  <img src={product.image} alt={product.name} className="w-16 h-16 object-cover rounded" />
                </td>
                <td className="py-3 px-6 font-medium">{product.name}</td>
                <td className="py-3 px-6 text-sm text-gray-600">{product.description}</td>
                <td className="py-3 px-6">{product.price} DH</td>
                <td className="py-3 px-6">
                  <button
                    onClick={() => handleDelete(product._id)}
                    className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-700 transition"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
