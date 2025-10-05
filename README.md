🔹 What is an Index in MongoDB?

An index in MongoDB works just like the index in a book.

Without an index → MongoDB must scan every document in the collection (called a COLLSCAN) → slow.

With an index → MongoDB quickly jumps to the exact documents → fast.

By default, MongoDB creates an index on _id for every collection.

🔹 Types of Indexes in MongoDB
1. Single Field Index

Creates an index on one field.

db.users.createIndex({ name: 1 })   // ascending order
db.users.createIndex({ age: -1 })   // descending order


👉 Used when queries mostly filter/sort on a single field.

2. Compound Index

Index on multiple fields.

db.users.createIndex({ name: 1, age: -1 })


👉 Useful for queries like:

db.users.find({ name: "John" }).sort({ age: -1 })

3. Text Index

For searching text inside string fields.

db.articles.createIndex({ content: "text", title: "text" })
db.articles.find({ $text: { $search: "mongodb index" } })


👉 Used for search engines or blogs.

4. Hashed Index

Distributes values using a hash → useful for sharding.

db.users.createIndex({ userId: "hashed" })

5. Wildcard Index

Indexes all fields or unknown fields in documents.

db.data.createIndex({ "$**": 1 })

🔹 Checking Indexes
db.users.getIndexes()

🔹 Dropping Index
db.users.dropIndex({ name: 1 })

🔹 Example Scenario

Suppose you have a users collection with 1 million documents:

db.users.find({ age: 25 })     // without index → slow


✅ Solution: Create an index:

db.users.createIndex({ age: 1 })


Now queries on age will use the index → much faster.

⚡ In short:

Use indexes when you frequently query/filter/sort large collections.

But avoid too many indexes → they slow down inserts/updates because MongoDB must maintain them.


# 🚀 Node.js + Express + MongoDB CRUD with Indexing

This project demonstrates how to build a RESTful API using **Express.js** and **MongoDB (via Mongoose)**.  
It includes CRUD operations, filtering, pagination, sorting, and indexing.

---

## 🧩 Tech Stack
- **Node.js** (Backend Runtime)
- **Express.js** (Web Framework)
- **MongoDB** (Database)
- **Mongoose** (ODM for MongoDB)

---

## 📂 Project Structure
```
project/
│
├── server.js           # Express app entry point
├── models/
│   └── User.js         # Mongoose schema/model
├── package.json
└── README.md
```

---

## ⚙️ Installation

```bash
# 1. Clone this repository
git clone https://github.com/<your-repo-name>.git

# 2. Install dependencies
npm install

# 3. Start MongoDB (locally or via Docker)
mongod

# 4. Start the server
npm start
```

Server will run at 👉 **http://localhost:3000**

---

## 🧠 Environment Setup

Create a `.env` file in your root directory:
```bash
PORT=3000
MONGO_URI=mongodb://localhost:27017/mydatabase
```

---

## 🧍 User Model (`models/User.js`)

```js
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: String,
  age: Number,
  role: String,
  email: String
});

// Create index to optimize search queries
userSchema.index({ name: 1 });       // Single field index
userSchema.index({ role: 1, age: 1 }); // Compound index

module.exports = mongoose.model('User', userSchema);
```

---

## 🧭 API Endpoints

| Method | Endpoint | Description | Example |
|--------|-----------|--------------|----------|
| GET | `/users` | Fetch users with filter/sort/pagination | `/users?q=john&role=admin&minAge=25&page=1&limit=5&sort=age` |
| POST | `/users` | Create new user | `POST /users` |
| PUT | `/users/:id` | Update user | `PUT /users/66e38aa3` |
| DELETE | `/users/:id` | Delete user | `DELETE /users/66e38aa3` |

---

## 🧩 Example Query Parameters

| Parameter | Description | Example |
|------------|--------------|----------|
| `q` | Search by name (case-insensitive) | `/users?q=john` |
| `minAge` | Filter users older than a certain age | `/users?minAge=25` |
| `role` | Filter by role | `/users?role=admin` |
| `limit` | Limit number of results | `/users?limit=5` |
| `page` | Pagination | `/users?page=2&limit=10` |
| `sort` | Sort results | `/users?sort=-age` |

---

## ⚡ MongoDB Index Commands

#### Create Index
```js
db.users.createIndex({ name: 1 });
```

#### View Indexes
```js
db.users.getIndexes();
```

#### Drop Index
```js
db.users.dropIndex({ name: 1 });
```

---

## 🧪 Testing with `curl`

```bash
# Fetch all users
curl http://localhost:3000/users

# Search for users by name
curl http://localhost:3000/users?q=john

# Create a new user
curl -X POST http://localhost:3000/users \
-H "Content-Type: application/json" \
-d '{"name":"John Doe","age":30,"role":"admin","email":"john@example.com"}'
```

---

## 🧮 Example: Nested Query (Advanced)
If your schema has nested fields, e.g.:
```js
address: {
  city: String,
  pincode: Number
}
```
Then you can query:
```js
db.users.find({ "address.city": "Mysore" });
```

---

## 📈 Performance Tips
- Use indexes on frequently queried fields.
- Avoid large `$regex` queries on non-indexed fields.
- Use projection (`.select()`) to limit returned data.
- Paginate results using `.skip()` and `.limit()`.

---

## 📚 License
MIT License © 2025 [Raghavendran V]
