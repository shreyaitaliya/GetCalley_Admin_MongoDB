const mongoose = require('mongoose');

const AgentHistorySchema = new mongoose.Schema({
    agentID: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
    },
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
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

const AgentHistoryModel = mongoose.model('agenthistory', AgentHistorySchema);

module.exports = { AgentHistoryModel };
