const mongoose = require('mongoose');

const subscriptionPlanSchema = new mongoose.Schema({
    name: { type: String, required: true },
    price: { type: Number, required: true },
    duration: { type: String, required: true },
    description: { type: String },
    role: {
        type: Number,
        enum: [1, 2, 3],
        default: 1,
        required: false
    }
});

// Create the model
const SubscriptionPlan = mongoose.model('SubscriptionPlan', subscriptionPlanSchema);

// Static data
const staticPlans = [
    { name: 'Calley PERSONAL', price: 0.0, duration: 'No Expiry', description: 'No Expiry Plan', role: 1 },
    { name: 'Calley PRO', price: 699.0, duration: 'Per Month', description: 'Monthly Plan', role: 2 },
    { name: 'Calley TEAMS', price: 1699.0, duration: 'Per Month', description: 'Team Monthly Plan', role: 3 },
];

// Insert static data if collection is empty
const initializeStaticData = async () => {
    try {
        const count = await SubscriptionPlan.countDocuments();   
        if (count === 0) {
            await SubscriptionPlan.insertMany(staticPlans);
            console.log('Static subscription plans inserted successfully.');
        } else {
            console.log('Static data already exists. Skipping insertion.');
        }
    } catch (err) {
        console.error('Error inserting static data:', err);
    }
};
initializeStaticData();

module.exports = { SubscriptionPlan }
