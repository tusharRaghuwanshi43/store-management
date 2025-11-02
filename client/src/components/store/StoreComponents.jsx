import React from 'react';

export const Toast = ({ show, message, type }) => (
  <div className={`fixed top-8 left-1/2 transform -translate-x-1/2 z-50 transition-all duration-300 ease-in-out ${show ? 'opacity-100 scale-100' : 'opacity-0 scale-95 pointer-events-none'}`}
    style={{ minWidth: '220px', maxWidth:'90vw' }}>
    <div className={`px-6 py-3 rounded-xl shadow-2xl font-semibold text-base md:text-lg border
      ${type === 'success' ? 'bg-green-100 text-green-900 border-green-300' : 'bg-red-100 text-red-800 border-red-300'}`}>
      {message}
    </div>
  </div>
);

export const Navbar = ({ onLogout }) => (
  <nav className="flex flex-col sm:flex-row sm:justify-between sm:items-center bg-white/90 backdrop-blur-md shadow-md rounded-xl mb-8 px-6 py-4 max-w-6xl mx-auto gap-4 sm:gap-0">
    <div className="flex items-center justify-center sm:justify-start gap-3">
      <h1 className="text-2xl sm:text-3xl font-extrabold text-purple-700 whitespace-nowrap">InventoryHive</h1>
      <img src="/logo.png" alt="InventoryHive Logo" className="w-10 h-10 sm:w-12 sm:h-12 object-contain" />
    </div>
    <button onClick={onLogout} className="bg-gradient-to-r from-pink-400 via-purple-500 to-indigo-500 text-white px-5 py-2 rounded-xl font-semibold hover:scale-105 transform transition shadow-md shadow-indigo-300 w-full sm:w-auto" title="Logout">Logout</button>
  </nav>
);

export const Filters = ({ filters, setFilters }) => {
  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
  };
  return (
    <div className="mb-8 rounded-xl bg-white/70 backdrop-blur-md shadow-xl p-4 max-w-6xl mx-auto">
      <h2 className="text-2xl font-bold text-indigo-700 mb-4">Filter Products</h2>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <input type="text" placeholder="Search products..." name="search" value={filters.search} onChange={handleFilterChange} className="rounded-lg border border-indigo-300 px-4 py-2 focus:ring-2 focus:ring-indigo-400" />
        <input type="text" placeholder="Category" name="category" value={filters.category} onChange={handleFilterChange} className="rounded-lg border border-purple-300 px-4 py-2 focus:ring-2 focus:ring-purple-400" />
        <input type="number" placeholder="Min price" name="minPrice" value={filters.minPrice} onChange={handleFilterChange} className="rounded-lg border border-pink-300 px-4 py-2 focus:ring-2 focus:ring-pink-400" />
        <input type="number" placeholder="Max price" name="maxPrice" value={filters.maxPrice} onChange={handleFilterChange} className="rounded-lg border border-pink-300 px-4 py-2 focus:ring-2 focus:ring-pink-400" />
        <input type="number" placeholder="Min stock" name="minStock" value={filters.minStock} onChange={handleFilterChange} className="rounded-lg border border-indigo-300 px-4 py-2 focus:ring-2 focus:ring-indigo-400" />
        <input type="number" placeholder="Max stock" name="maxStock" value={filters.maxStock} onChange={handleFilterChange} className="rounded-lg border border-indigo-300 px-4 py-2 focus:ring-2 focus:ring-indigo-400" />
        <select name="sortBy" value={filters.sortBy} onChange={handleFilterChange} className="rounded-lg border border-purple-300 px-4 py-2 focus:ring-2 focus:ring-purple-400">
          <option value="createdAt">Sort by: Date</option>
          <option value="price">Sort by: Price</option>
          <option value="name">Sort by: Name</option>
          <option value="stock">Sort by: Stock</option>
        </select>
        <select name="order" value={filters.order} onChange={handleFilterChange} className="rounded-lg border border-pink-300 px-4 py-2 focus:ring-2 focus:ring-pink-400">
          <option value="desc">Order: Descending</option>
          <option value="asc">Order: Ascending</option>
        </select>
      </div>
    </div>
  );
};

export const ProductList = ({ products, handleDeleteItem, handleUpdateItem }) => (
  <div className="rounded-2xl bg-white/90 shadow-xl p-4 max-w-6xl mx-auto overflow-x-auto">
    <header className="mb-2"><h3 className="text-2xl font-bold text-indigo-700">Products</h3></header>
    <table className="min-w-full table-auto border border-gray-200">
      <thead>
        <tr className="bg-gradient-to-r from-purple-200 via-pink-200 to-indigo-200">
          <th className="py-2 px-4 text-left">#</th>
          <th className="py-2 px-4 text-left">SKU</th>
          <th className="py-2 px-4 text-left">Name</th>
          <th className="py-2 px-4 text-left">Category</th>
          <th className="py-2 px-4 text-left">Price</th>
          <th className="py-2 px-4 text-left">Stock</th>
          <th className="py-2 px-4 text-center">Actions</th>
        </tr>
      </thead>
      <tbody>
        {products && products.map((item, idx) => (
          <tr key={item._id || idx} className="hover:bg-indigo-50 transition">
            <td className="py-2 px-4">{idx + 1}</td>
            <td className="py-2 px-4">{item.sku}</td>
            <td className="py-2 px-4 font-medium text-purple-700">{item.name}</td>
            <td className="py-2 px-4">{item.category || '-'}</td>
            <td className="py-2 px-4">${Number(item.price).toFixed(2)}</td>
            <td className="py-2 px-4">{item.stock}</td>
            <td className="py-2 px-4 flex gap-1 justify-center">
              <button className="bg-indigo-500 hover:bg-indigo-600 text-white rounded px-3 py-1 text-sm shadow transition" onClick={() => handleUpdateItem(item._id)}>Edit</button>
              <button className="bg-pink-500 hover:bg-pink-600 text-white rounded px-3 py-1 text-sm shadow transition" onClick={() => handleDeleteItem(item._id)}>Delete</button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);
