# 🏪 Store-Management System

This is a full-stack MERN (MongoDB, Express, React, Node.js) application designed for efficient store management. It features a secure admin login page to protect and manage store data.

Once logged in, an admin can perform complete CRUD (Create, Read, Update, Delete) operations on store inventory, customer records, and item lists. The application also includes a real-time search and filter capability.

**[View Live Demo](https://store-mgmt.netlify.app/)** *(Note: Admin login credentials may be required for full functionality on the live demo.)*

---

## ✨ Key Features

* **🔐 Secure Admin Authentication:** A dedicated login page for administrators to access the management dashboard.
* **📦 Inventory Management:** Full CRUD capabilities for all store inventory.
* **👥 Customer Management:** Add, edit, view, and delete customer records.
* **🧾 Item Management:** A dedicated module for managing item details.
* **🔍 Live Search & Filter:** Dynamically filter and search through all records.
* **📱 Responsive UI:** Built with React for a seamless experience on all devices.
* **⚙️ RESTful API:** A robust backend API built with Node.js and Express.

---

## 🧰 Tech Stack

| Category | Technology |
| :--- | :--- |
| **Front-End** | React.js, CSS |
| **Back-End** | Node.js, Express.js, JWT (for auth), bcrypt (for hashing) |
| **Database** | MongoDB (with Mongoose) |
| **Deployment** | Netlify (Client), TBD (Server) |

---

## 🚀 Getting Started

Follow these instructions to get a copy of the project up and running on your local machine for development and testing.

### 1. Prerequisites

You must have the following installed on your machine:
* [Node.js](https://nodejs.org/) (v16 or later)
* [npm](https://www.npmjs.com/) or [yarn](https://yarnpkg.com/)
* [Git](https://git-scm.com/)
* [MongoDB](https://www.mongodb.com/try/download/community) (a local instance or a cloud-hosted URI from MongoDB Atlas)

### 2. Installation & Setup

```bash
# 1. Clone the repository
git clone [https://github.com/tusharRaghuwanshi43/store-management.git](https://github.com/tusharRaghuwanshi43/store-management.git)

# 2. Navigate to the project directory
cd store-management
```
###  3. Backend Setup (Server)

```bash
# 1. Go to the server directory
cd server

# 2. Install backend dependencies
npm install

# 3. Add the following environment variables to your .env file:
MONGODB_URI=your_mongodb_connection_string
PORT=5000
JWT_SECRET=your_super_secret_key_for_jwt

# 4. Start the backend server
npm start
```
### 4. Frontend Setup (Client)

```bash
# 1. Open a NEW terminal and go to the client directory
#    (from the root 'store-management' folder)
cd client

# 2. Install frontend dependencies
npm install

# 3. Start the React development server
npm start