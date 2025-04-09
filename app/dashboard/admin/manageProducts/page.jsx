'use client';

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { PencilIcon, TrashIcon } from '@heroicons/react/24/outline';
import StyledAlert from '@/app/components/StyledAlert';

export default function ManageProducts() {
  const [productList, setProductList] = useState([]);
  const [newProduct, setNewProduct] = useState({ name: '', description: '', price: '', image: null });
  const [loading, setLoading] = useState(true);
  const [editingProduct, setEditingProduct] = useState(null);
  const [alert, setAlert] = useState({ message: '', type: '', show: false });

  const showAlert = (message, type = 'info') => {
    setAlert({ message, type, show: true });
  };

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
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        await axios.delete(`http://localhost:5000/api/products/${id}`);
        setProductList(productList.filter((product) => product._id !== id));
        showAlert('Product deleted successfully!', 'success');
      } catch (error) {
        console.error('Error deleting product:', error);
        showAlert('Failed to delete product. Please try again.', 'error');
      }
    }
  };

  const handleEdit = (product) => {
    setEditingProduct(product);
    setNewProduct({
      name: product.name,
      description: product.description,
      price: product.price,
      image: product.image
    });
  };

  const handleUpdate = async (e) => {
    e.preventDefault();

    if (!editingProduct) return;

    try {
      const productData = {
        name: newProduct.name.trim(),
        description: newProduct.description.trim(),
        price: parseFloat(newProduct.price)
      };

      if (newProduct.image !== editingProduct.image) {
        productData.image = newProduct.image;
      }

      console.log('Updating product with data:', {
        id: editingProduct._id,
        ...productData
      });

      const response = await axios.put(
        `http://localhost:5000/api/products/${editingProduct._id}`,
        productData
      );
      
      if (response.data) {
        setProductList(productList.map(product => 
          product._id === editingProduct._id ? response.data : product
        ));

        setEditingProduct(null);
        setNewProduct({ name: '', description: '', price: '', image: null });
        
        showAlert('Product updated successfully!', 'success');
      }
    } catch (error) {
      console.error('Error updating product:', error);
      if (error.response) {
        console.error('Server response:', error.response.data);
        const errorMessage = error.response.data.message || 'Failed to update product';
        showAlert(`Error: ${errorMessage}`, 'error');
      } else {
        showAlert('Failed to update product. Please try again.', 'error');
      }
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

    try {
      const productData = {
        name: newProduct.name.trim(),
        description: newProduct.description.trim(),
        price: parseFloat(newProduct.price),
        image: newProduct.image
      };

      const response = await axios.post('http://localhost:5000/api/products', productData);
      
      if (response.data) {
        setProductList([...productList, response.data]);
        setNewProduct({ name: '', description: '', price: '', image: null });
        showAlert('Product added successfully!', 'success');
      }
    } catch (error) {
      console.error('Error adding product:', error);
      if (error.response) {
        console.error('Server response:', error.response.data);
        const errorMessage = error.response.data.message || 'Failed to add product';
        showAlert(`Error: ${errorMessage}`, 'error');
      } else {
        showAlert('Failed to add product. Please try again.', 'error');
      }
    }
  };

  if (loading) {
    return <div className="p-8 text-center">Loading products...</div>;
  }

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      {alert.show && (
        <StyledAlert
          message={alert.message}
          type={alert.type}
          onClose={() => setAlert({ ...alert, show: false })}
        />
      )}
      <h1 className="text-4xl font-extrabold text-center text-[#7FA15A] mb-12">Manage Products</h1>

      {/* Add/Edit Product Form */}
      <div className="bg-white shadow-md rounded-lg p-6 mb-6">
        <h2 className="text-2xl font-semibold text-[#7FA15A] mb-6 text-center">
          {editingProduct ? 'Edit Product' : 'Add New Product'}
        </h2>
        <form onSubmit={editingProduct ? handleUpdate : handleAddProduct} className="space-y-4">
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
            className="w-full px-4 py-2 b order border-gray-300 rounded"
            required={!editingProduct}
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
          <div className="flex space-x-4">
            <button
              type="submit"
              className="flex-1 bg-[#7FA15A] text-white py-2 rounded hover:bg-[#6a8c4f] transition"
            >
              {editingProduct ? 'Update Product' : 'Add Product'}
            </button>
            {editingProduct && (
              <button
                type="button"
                onClick={() => {
                  setEditingProduct(null);
                  setNewProduct({ name: '', description: '', price: '', image: null });
                }}
                className="flex-1 bg-gray-500 text-white py-2 rounded hover:bg-gray-600 transition"
              >
                Cancel
              </button>
            )}
          </div>
        </form>
      </div>

      {/* Product Table */}
      <div className="bg-white shadow-md rounded-lg p-6 overflow-x-auto mt-16">
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
                  <div className="flex space-x-2">
                    <button
                      onClick={() => handleEdit(product)}
                      className="p-2 text-blue-600 hover:text-blue-800 transition"
                      title="Edit"
                    >
                      <PencilIcon className="h-5 w-5" />
                    </button>
                    <button
                      onClick={() => handleDelete(product._id)}
                      className="p-2 text-red-600 hover:text-red-800 transition"
                      title="Delete"
                    >
                      <TrashIcon className="h-5 w-5" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}