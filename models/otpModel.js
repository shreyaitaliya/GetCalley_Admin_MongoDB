const mongoose = require('mongoose');

const otpschema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
    },
    otp: {
        type: String,
        required: true,
    },
});

const OtpModel = mongoose.model('otp', otpschema);

module.exports = { OtpModel };
