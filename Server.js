// server.js
require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const User = require('./models/User');


const app = express();
app.use(express.json());

const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017/demoDB';
mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('MongoDB connected'))
    .catch(err => console.error('MongoDB connection error', err));

// CREATE user
app.post('/users', async (req, res) => {
    try {
        const user = new User(req.body);
        await user.save();
        res.status(201).json(user);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});


app.get('/users', async (req, res) => {
    try {
        // Example query params: ?minAge=25&role=admin&limit=10&page=1
        const { minAge, role, q, limit = 10, page = 1, sort } = req.query;
        console.log("req.query:", req.query);

        const filter = {};
        if (minAge) filter.age = { $gte: Number(minAge) };
        if (role) filter.roles = role;
        if (q) filter.name = { $regex: q, $options: 'i' };

        console.log("filter:", filter);

        const users = await User.find(filter)
            .select('-__v') // projection
            .sort(sort || 'name')
            .skip((page - 1) * limit)
            .limit(Number(limit));

        res.json(users);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});


app.get('/users/:id', async (req, res) => {
    try {
        const u = await User.findById(req.params.id).select('-__v');
        if (!u) return res.status(404).json({ error: 'Not found' });
        res.json(u);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

// UPDATE (PATCH semantics)
app.patch('/users/:id', async (req, res) => {
    try {
        const updated = await User.findByIdAndUpdate(req.params.id, { $set: req.body }, { new: true, runValidators: true });
        if (!updated) return res.status(404).json({ error: 'Not found' });
        res.json(updated);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});


// DELETE
app.delete('/users/:id', async (req, res) => {
    try {
        const deleted = await User.findByIdAndDelete(req.params.id);
        if (!deleted) return res.status(404).json({ error: 'Not found' });
        res.json({ message: 'Deleted', id: deleted._id });
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});



const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Server running on port ${port}`));
