// superAdminModel.js
const mongoose = require('mongoose');

const superAdminSchema = mongoose.Schema({
    email: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true,
    },
    role: {
        type: String,
        required: true,
    }
});

const SuperAdmin = mongoose.model('superAdmin', superAdminSchema);

const defaultData = [
    {
        email: 'superadmin@example.com',
        password: 'superpassword',
        role: 'superadmin',
    }
];

// Function to insert data if it doesn't already exist
async function insertDefaultData() {
    try {
        const count = await SuperAdmin.countDocuments();
        if (count === 0) {
            await SuperAdmin.create(defaultData);
            console.log('Default data inserted successfully.');
        } else {
            console.log('Data already exists, skipping insertion.');
        }
    } catch (error) {
        console.error('Error inserting default data:', error);
    }
}

module.exports = { SuperAdmin, insertDefaultData };