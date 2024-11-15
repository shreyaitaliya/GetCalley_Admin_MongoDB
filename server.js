const express = require('express');
const connectDB = require('./config/db');
const cors = require('cors');
const dotenv = require('dotenv');
const { insertDefaultData } = require('./models/superAdminModel');
const path = require('path');

dotenv.config();
const app = express();
const PORT = process.env.PORT || 5000;

// Connect to MongoDB
connectDB().then(() => insertDefaultData());

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/v1', require('./routes/index'));

// Start server
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));