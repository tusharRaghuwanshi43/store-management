import React, { useState, useEffect } from "react";
import axios from "axios";

const App = () => {
  const [items, setItems] = useState([]);
  const [newItem, setNewItem] = useState({
    name: "",
    sku: "",
    price: "",
    stock: "",
    category: "",
  });
  const [itemBtn, setItemBtn] = useState("Add product");
  const [itemVariant, setItemVariant] = useState({ edit: true, id: "" });

  const BASE_URL = "https://store-management-eosin.vercel.app/api";
  const getItems = `${BASE_URL}/products`;
  const postItem = `${BASE_URL}/addProduct`;

  const [filters, setFilters] = useState({
    search: '',
    category: '',
    minPrice: '',
    maxPrice: '',
    minStock: '',
    maxStock: '',
    sortBy: 'createdAt',
    order: 'desc'
  });

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
  };

  const fetchItems = async () => {
    try {
      const queryParams = new URLSearchParams();
      if (filters.search) queryParams.append('search', filters.search);
      if (filters.category) queryParams.append('category', filters.category);
      if (filters.minPrice) queryParams.append('minPrice', filters.minPrice);
      if (filters.maxPrice) queryParams.append('maxPrice', filters.maxPrice);
      if (filters.minStock) queryParams.append('minStock', filters.minStock);
      if (filters.maxStock) queryParams.append('maxStock', filters.maxStock);
      if (filters.sortBy) queryParams.append('sortBy', filters.sortBy);
      if (filters.order) queryParams.append('order', filters.order);

      const response = await axios.get(`${getItems}?${queryParams}`);
      setItems(response.data.products);
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  };

  useEffect(() => {
    fetchItems();
  }, [filters]);

  const handleAddItem = async (e) => {
    e.preventDefault();

    if (itemVariant.edit) {
      try {
        const skuExists = items.some((it) => it.sku === newItem.sku);
        if (skuExists) {
          alert("SKU already exists. Please use a different SKU.");
          return;
        }
        if (newItem.name && newItem.sku && newItem.price && newItem.stock) {
          const response = await axios.post(postItem, newItem);
          setItems([response.data, ...items]);
          setNewItem({ name: "", sku: "", price: "", stock: "", category: "" });
        } else {
          alert("Please fill in all required fields (name, sku, price, stock).");
        }
      } catch (error) {
        console.error("Error adding product:", error);
      }
      setItemBtn("Add product");
    } else {
      const putUrl = `${BASE_URL}/products/${itemVariant.id}`;
      try {
        await axios.put(putUrl, newItem);
        fetchItems();
        setNewItem({ name: "", sku: "", price: "", stock: "", category: "" });
        setItemVariant({ edit: true, id: "" });
        setItemBtn("Add product");
      } catch (error) {
        console.error("Error updating product:", error);
      }
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewItem((prev) => ({ ...prev, [name]: value }));
  };

  const handleDeleteItem = async (id) => {
    const delUrl = `${BASE_URL}/products/${id}`;
    try {
      await axios.delete(delUrl);
      fetchItems();
    } catch (error) {
      console.error("Error deleting product:", error);
    }
  };

  const handleUpdateItem = (id) => {
    const found = items.find((it) => it._id === id);
    if (!found) return;
    setNewItem({
      name: found.name,
      sku: found.sku,
      price: found.price,
      stock: found.stock,
      category: found.category || "",
    });
    setItemBtn("Update product");
    setItemVariant({ edit: false, id });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-100 via-purple-100 to-pink-200 px-4 py-8 font-sans">
      <div className="max-w-6xl mx-auto">
        {/* Filters Panel */}
        <div className="mb-8 rounded-xl bg-white/70 backdrop-blur-md shadow-xl p-4">
          <h2 className="text-2xl font-bold text-indigo-600 mb-4">Filter Products</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <input
              type="text"
              placeholder="Search products..."
              name="search"
              value={filters.search}
              onChange={handleFilterChange}
              className="rounded-lg border border-indigo-300 px-4 py-2 focus:ring-2 focus:ring-indigo-400"
            />
            <input
              type="text"
              placeholder="Category"
              name="category"
              value={filters.category}
              onChange={handleFilterChange}
              className="rounded-lg border border-purple-300 px-4 py-2 focus:ring-2 focus:ring-purple-400"
            />
            <input
              type="number"
              placeholder="Min price"
              name="minPrice"
              value={filters.minPrice}
              onChange={handleFilterChange}
              className="rounded-lg border border-pink-300 px-4 py-2 focus:ring-2 focus:ring-pink-400"
            />
            <input
              type="number"
              placeholder="Max price"
              name="maxPrice"
              value={filters.maxPrice}
              onChange={handleFilterChange}
              className="rounded-lg border border-pink-300 px-4 py-2 focus:ring-2 focus:ring-pink-400"
            />
            <input
              type="number"
              placeholder="Min stock"
              name="minStock"
              value={filters.minStock}
              onChange={handleFilterChange}
              className="rounded-lg border border-indigo-300 px-4 py-2 focus:ring-2 focus:ring-indigo-400"
            />
            <input
              type="number"
              placeholder="Max stock"
              name="maxStock"
              value={filters.maxStock}
              onChange={handleFilterChange}
              className="rounded-lg border border-indigo-300 px-4 py-2 focus:ring-2 focus:ring-indigo-400"
            />
            <select
              name="sortBy"
              value={filters.sortBy}
              onChange={handleFilterChange}
              className="rounded-lg border border-purple-300 px-4 py-2 focus:ring-2 focus:ring-purple-400"
            >
              <option value="createdAt">Sort by: Date</option>
              <option value="price">Sort by: Price</option>
              <option value="name">Sort by: Name</option>
              <option value="stock">Sort by: Stock</option>
            </select>
            <select
              name="order"
              value={filters.order}
              onChange={handleFilterChange}
              className="rounded-lg border border-pink-300 px-4 py-2 focus:ring-2 focus:ring-pink-400"
            >
              <option value="desc">Order: Descending</option>
              <option value="asc">Order: Ascending</option>
            </select>
          </div>
        </div>

        {/* Add/Update Product Form */}
        <div className="mb-8 rounded-xl bg-white/80 shadow-lg p-4 flex flex-col md:flex-row items-center justify-between">
        <div className="flex justify-center mb-8">
          <img
            src="src/assets/360_F_550146337_826DHUXoFx18MRTMUauX3fyRw9R7S1BO.jpg"
            alt="Store Management Illustration"
            className="rounded-2xl shadow-xl w-full max-w-2xl object-contain"
            style={{ background: "#F8FAFC" }}
          />
        </div>
          <h1 className="text-3xl font-bold text-purple-700 mb-4 md:mb-0">Store Management</h1>
          <form
            onSubmit={handleAddItem}
            className="flex flex-wrap gap-2 items-center"
            autoComplete="off"
          >
            <input
              type="text"
              placeholder="Product name"
              autoComplete="off"
              name="name"
              value={newItem.name}
              onChange={handleInputChange}
              className="rounded-lg border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-indigo-400"
            />
            <input
              type="text"
              placeholder="SKU"
              autoComplete="off"
              name="sku"
              value={newItem.sku}
              onChange={handleInputChange}
              className="rounded-lg border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-indigo-400"
            />
            <input
              type="number"
              placeholder="Price"
              autoComplete="off"
              name="price"
              value={newItem.price}
              onChange={handleInputChange}
              step="0.01"
              className="rounded-lg border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-pink-400"
            />
            <input
              type="number"
              placeholder="Stock"
              autoComplete="off"
              name="stock"
              value={newItem.stock}
              onChange={handleInputChange}
              className="rounded-lg border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-purple-400"
            />
            <input
              type="text"
              placeholder="Category (optional)"
              autoComplete="off"
              name="category"
              value={newItem.category}
              onChange={handleInputChange}
              className="rounded-lg border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-indigo-400"
            />
            <button
              type="submit"
              className="bg-gradient-to-r from-purple-500 via-pink-500 to-indigo-500 text-white font-semibold px-6 py-2 rounded-lg shadow hover:scale-105 transition"
            >
              {itemBtn}
            </button>
          </form>
        </div>

        {/* Products Listing Table */}
        <div className="rounded-2xl bg-white/90 shadow-xl p-4">
          <header className="mb-2">
            <h3 className="text-2xl font-bold text-indigo-700">Products</h3>
          </header>
          <div className="overflow-x-auto">
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
                {items &&
                  items.map((item, idx) => (
                    <tr
                      key={item._id || idx}
                      className="hover:bg-indigo-50 transition"
                    >
                      <td className="py-2 px-4">{idx + 1}</td>
                      <td className="py-2 px-4">{item.sku}</td>
                      <td className="py-2 px-4 font-medium text-purple-700">{item.name}</td>
                      <td className="py-2 px-4">{item.category || "-"}</td>
                      <td className="py-2 px-4">${Number(item.price).toFixed(2)}</td>
                      <td className="py-2 px-4">{item.stock}</td>
                      <td className="py-2 px-4 flex gap-1 justify-center">
                        <button
                          className="bg-indigo-500 hover:bg-indigo-600 text-white rounded px-3 py-1 text-sm shadow transition"
                          onClick={() => handleUpdateItem(item._id)}
                        >
                          Edit
                        </button>
                        <button
                          className="bg-pink-500 hover:bg-pink-600 text-white rounded px-3 py-1 text-sm shadow transition"
                          onClick={() => handleDeleteItem(item._id)}
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
      </div>
    </div>
  );
};

export default App;
