require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json()); 
app.use(express.static(path.join(__dirname, 'public'))); // Serves HTML files automatically

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI)
    .then(() => console.log('Successfully connected to MongoDB.'))
    .catch(err => console.error('MongoDB connection error:', err));

// Define the Schema matching your 'credentials' collection structure
const credentialSchema = new mongoose.Schema({
    username: { type: String, required: true },
    password: { type: String, required: true }
}, { collection: 'credentials' }); // Enforces targeting the 'credentials' collection

const Credential = mongoose.model('credentials', credentialSchema);

// Handle the Login POST Request
app.post('/api/login', async (req, res) => {
    const { username, password } = req.body;

    try {
        // Query the 'credentials' collection for an exact username and password match
        const account = await Credential.findOne({ username: username, password: password });

        if (account) {
            // Document found, credentials are valid
            return res.status(200).json({ success: true, message: "Authentication successful." });
        } else {
            // No matching document found
            return res.status(401).json({ success: false, message: "Invalid username or password." });
        }
    } catch (error) {
        return res.status(500).json({ success: false, message: "Internal server error." });
    }
});

app.get('/api/login', async (req, res) => {
    const { username, password } = req.body;

    try {
        // Query the 'credentials' collection for an exact username and password match
        const account = await Credential.findOne({ username: username, password: password });

        if (account) {
            // Document found, credentials are valid
            return res.status(200).json({ success: true, message: "Authentication successful." });
        } else {
            // No matching document found
            return res.status(401).json({ success: false, message: "Invalid username or password." });
        }
    } catch (error) {
        return res.status(500).json({ success: false, message: "Internal server error." });
    }
});

// Start Application
app.listen(PORT, () => {
    console.log(`Server executing at http://localhost:${PORT}`);
});