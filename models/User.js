const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name: { type: String, required: true, index: true },
    email: { type: String, required: true, unique: true },
    age: { type: Number, min: 0 },
    roles: { type: [String], default: ['user'] },
    address: {
        city: String,
        zip: String
    },
    createdAt: { type: Date, default: Date.now }
});

// example pre-save middleware
userSchema.pre('save', function (next) {
    // this = doc
    if (!this.roles || this.roles.length === 0) {
        this.roles = ['user'];
    }
    next();
});

module.exports = mongoose.model('User', userSchema);
