const mongoose = require('mongoose');

const AgentSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    mobilenumber: {
        type: Number,
        required: true,
    },
    email: {
        type: String,
        default: 'Active',
        required: false
    },
    password: {
        type: String,
        default: 'Active',
        required: false
    },
    createdBy: {
        type: String,
        required: true,
    },
    createdOn: {
        type: Date,
        default: Date.now,
    },
});

const AgentModel = mongoose.model('agent', AgentSchema);

module.exports = { AgentModel };
