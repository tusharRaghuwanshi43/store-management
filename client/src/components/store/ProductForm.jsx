import React from 'react';

const ProductForm = ({ newItem, setNewItem, handleAddItem, itemBtn }) => {
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewItem(prev => ({ ...prev, [name]: value }));
  };

  return (
    <div className="mb-8 rounded-xl bg-white/80 shadow-lg p-8 flex flex-col md:flex-row items-center justify-center gap-10 max-w-6xl mx-auto">
      <div className="w-full md:w-1/2 flex justify-center items-center">
        <img src="/store.jpg" alt="Store Management Illustration" className="rounded-2xl shadow-xl w-full max-w-md object-contain bg-white" style={{ background: '#F8FAFC' }} />
      </div>
      <div className="w-full md:w-1/2 flex flex-col justify-center items-center">
        <h1 className="text-4xl font-bold text-purple-700 mb-8 text-center">Store Management</h1>
        <form onSubmit={handleAddItem} className="flex flex-col gap-4 w-full max-w-sm" autoComplete="off">
          <input type="text" placeholder="Product name" autoComplete="off" name="name" value={newItem.name} onChange={handleInputChange} className="rounded-lg border border-gray-300 px-4 py-3 focus:ring-2 focus:ring-indigo-400" />
          <input type="text" placeholder="SKU" autoComplete="off" name="sku" value={newItem.sku} onChange={handleInputChange} className="rounded-lg border border-gray-300 px-4 py-3 focus:ring-2 focus:ring-indigo-400" />
          <input type="number" placeholder="Price" autoComplete="off" name="price" value={newItem.price} onChange={handleInputChange} step="0.01" className="rounded-lg border border-gray-300 px-4 py-3 focus:ring-2 focus:ring-pink-400" />
          <input type="number" placeholder="Stock" autoComplete="off" name="stock" value={newItem.stock} onChange={handleInputChange} className="rounded-lg border border-gray-300 px-4 py-3 focus:ring-2 focus:ring-purple-400" />
          <input type="text" placeholder="Category (optional)" autoComplete="off" name="category" value={newItem.category} onChange={handleInputChange} className="rounded-lg border border-gray-300 px-4 py-3 focus:ring-2 focus:ring-indigo-400" />
          <button type="submit" className="bg-gradient-to-r from-purple-500 via-pink-500 to-indigo-500 text-white font-semibold px-8 py-3 rounded-lg shadow hover:scale-105 transition w-full">{itemBtn}</button>
        </form>
      </div>
    </div>
  );
};

export default ProductForm;
