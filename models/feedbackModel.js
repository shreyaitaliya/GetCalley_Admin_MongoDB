const mongoose = require('mongoose');

const feedbackSchema = new mongoose.Schema({
    heading: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    status: {
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

const FeedbackModel = mongoose.model('feedback', feedbackSchema);

module.exports = { FeedbackModel };
