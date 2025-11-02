import React, { useState, useEffect } from 'react';
import axios from 'axios';
import * as StoreComponents from './StoreComponents';
import ProductForm from './ProductForm';

const StoreManager = () => {
  const [products, setProducts] = useState([]);
  const [filters, setFilters] = useState({
    search: '', category: '', minPrice: '', maxPrice: '',
    minStock: '', maxStock: '', sortBy: 'createdAt', order: 'desc'
  });
  const [newItem, setNewItem] = useState({ name:'', sku:'', price:'', stock:'', category:'' });
  const [itemBtn, setItemBtn] = useState('Add product');
  const [itemVariant, setItemVariant] = useState({ edit: true, id: '' });
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [toastType, setToastType] = useState('success');

  const BASE_URL = 'https://store-management-eosin.vercel.app/api';
  const token = localStorage.getItem('token');
  const config = { headers: { Authorization: `Bearer ${token}` } };

  const showMessage = (msg, type='success') => {
    setToastMessage(msg);
    setToastType(type);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 1600);
  };

  const fetchProducts = async () => {
    try {
      const queryParams = new URLSearchParams();
      Object.entries(filters).forEach(([key, val]) => {
        if (val) queryParams.append(key, val);
      });
      const response = await axios.get(`${BASE_URL}/products?${queryParams}`, config);
      setProducts(response.data.products);
    } catch (error) {
      showMessage('Failed to fetch products. Please login again.', 'error');
      localStorage.removeItem('token');
      window.location.href = '/';
    }
  };

  useEffect(() => { fetchProducts(); }, [filters]);

  const handleAddItem = async (e) => {
    e.preventDefault();
    if (itemVariant.edit) {
      if (products.some(p => p.sku === newItem.sku)) {
        showMessage('SKU already exists. Use a different SKU.', 'error');
        return;
      }
      if (newItem.name && newItem.sku && newItem.price && newItem.stock) {
        try {
          const res = await axios.post(`${BASE_URL}/products`, newItem, config);
          setProducts([res.data, ...products]);
          showMessage('Product added successfully!');
          setNewItem({ name:'', sku:'', price:'', stock:'', category:'' });
          setItemBtn('Add product');
        } catch {
          showMessage('Failed to add product. Please try again.', 'error');
        }
      } else showMessage('Fill all required fields.', 'error');
    } else {
      try {
        await axios.put(`${BASE_URL}/products/${itemVariant.id}`, newItem, config);
        fetchProducts();
        showMessage('Product updated successfully!');
        setNewItem({ name:'', sku:'', price:'', stock:'', category:'' });
        setItemVariant({ edit: true, id: '' });
        setItemBtn('Add product');
      } catch {
        showMessage('Failed to update product. Please try again.', 'error');
      }
    }
  };

  const handleDeleteItem = async (id) => {
    if (!window.confirm('Confirm delete?')) return;
    try {
      await axios.delete(`${BASE_URL}/products/${id}`, config);
      fetchProducts();
      showMessage('Product deleted successfully!');
    } catch {
      showMessage('Failed to delete product.', 'error');
    }
  };

  const handleUpdateItem = (id) => {
    const product = products.find(p => p._id === id);
    if (!product) return;
    setNewItem(product);
    setItemBtn('Update product');
    setItemVariant({ edit: false, id });
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    window.location.href = '/';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-100 via-purple-100 to-pink-200 px-4 py-8 font-sans">
      <StoreComponents.Navbar onLogout={handleLogout} />
      <StoreComponents.Toast show={showToast} message={toastMessage} type={toastType} />
      <StoreComponents.Filters filters={filters} setFilters={setFilters} />
      <ProductForm
        newItem={newItem}
        setNewItem={setNewItem}
        handleAddItem={handleAddItem}
        itemBtn={itemBtn}
      />
      <StoreComponents.ProductList
        products={products}
        handleDeleteItem={handleDeleteItem}
        handleUpdateItem={handleUpdateItem}
      />
    </div>
  );
};

export default StoreManager;
