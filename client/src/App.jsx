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

  // API base
  const BASE_URL = "http://localhost:5000/api";
  const getItems = `${BASE_URL}/products`;
  const postItem = `${BASE_URL}/addProduct`;

  // // fetch products
  // const fetchItems = async () => {
  //   try {
  //     const response = await axios.get(getItems);
  //     setItems(response.data.reverse());
  //   } catch (error) {
  //     console.error("Error fetching products:", error);
  //   }
  // };

  // useEffect(() => {
  //   fetchItems();
  // }, []);

  // Add these new state variables after other useState declarations
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
  
  // Add this new function before the return statement
  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
  };
  
  // Modify the fetchItems function to include filters
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
  
  // Add useEffect dependency for filters
  useEffect(() => {
    fetchItems();
  }, [filters]); // This will fetch items whenever filters change

  // add or update product
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
          alert(
            "Please fill in all required fields (name, sku, price, stock)."
          );
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
    <div>
    <div className="filters-container">
      <div className="filters-grid">
        <input
          type="text"
          placeholder="Search products..."
          name="search"
          value={filters.search}
          onChange={handleFilterChange}
          className="filter-input"
        />
        <input
          type="text"
          placeholder="Category"
          name="category"
          value={filters.category}
          onChange={handleFilterChange}
          className="filter-input"
        />
        <input
          type="number"
          placeholder="Min price"
          name="minPrice"
          value={filters.minPrice}
          onChange={handleFilterChange}
          className="filter-input"
        />
        <input
          type="number"
          placeholder="Max price"
          name="maxPrice"
          value={filters.maxPrice}
          onChange={handleFilterChange}
          className="filter-input"
        />
        <input
          type="number"
          placeholder="Min stock"
          name="minStock"
          value={filters.minStock}
          onChange={handleFilterChange}
          className="filter-input"
        />
        <input
          type="number"
          placeholder="Max stock"
          name="maxStock"
          value={filters.maxStock}
          onChange={handleFilterChange}
          className="filter-input"
        />
        <select
          name="sortBy"
          value={filters.sortBy}
          onChange={handleFilterChange}
          className="filter-input"
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
          className="filter-input"
        >
          <option value="desc">Order: Descending</option>
          <option value="asc">Order: Ascending</option>
        </select>
      </div>
    </div>
      <div className="container">
        <h1>Store Management</h1>
        <form onSubmit={handleAddItem}>
          <input
            type="text"
            placeholder="Product name"
            autoComplete="off"
            name="name"
            value={newItem.name}
            onChange={handleInputChange}
          />
          <input
            type="text"
            placeholder="SKU"
            autoComplete="off"
            name="sku"
            value={newItem.sku}
            onChange={handleInputChange}
          />
          <input
            type="number"
            placeholder="Price"
            autoComplete="off"
            name="price"
            value={newItem.price}
            onChange={handleInputChange}
            step="0.01"
          />
          <input
            type="number"
            placeholder="Stock quantity"
            autoComplete="off"
            name="stock"
            value={newItem.stock}
            onChange={handleInputChange}
          />
          <input
            type="text"
            placeholder="Category (optional)"
            autoComplete="off"
            name="category"
            value={newItem.category}
            onChange={handleInputChange}
          />
          <button>{itemBtn}</button>
        </form>
      </div>

      <div className="container">
        <header className="header">
          <h3>Products</h3>
        </header>
        <div className="table-container">
          <table className="table">
            <thead>
              <tr>
                <th>#</th>
                <th>SKU</th>
                <th>Name</th>
                <th>Category</th>
                <th>Price</th>
                <th>Stock</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {items &&
                items.map((item, idx) => (
                  <tr key={item._id || idx}>
                    <td>{idx + 1}</td>
                    <td>{item.sku}</td>
                    <td>{item.name}</td>
                    <td>{item.category || "-"}</td>
                    <td>${Number(item.price).toFixed(2)}</td>
                    <td>{item.stock}</td>
                    <td>
                      <button
                        className="edit_btn action-btn"
                        onClick={() => handleUpdateItem(item._id)}
                      >
                        Edit
                      </button>
                      <button
                        className="delete_btn action-btn"
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
  );
};

export default App;
