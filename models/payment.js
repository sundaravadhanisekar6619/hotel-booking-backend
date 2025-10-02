const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const paymentSchema = new Schema({
    booking: { type: Schema.Types.ObjectId, ref: 'Booking', required: true },
    transactionId: { type: String, required: true },
    amount: { type: Number, required: true },
    method: { type: String, enum: ['card', 'upi', 'wallet', 'netbanking'], required: true },
    status: { type: String, enum: ['success', 'failed', 'pending'], default: 'pending' },
    paidAt: { type: Date }
}, { timestamps: true });

module.exports = mongoose.model('Payment', paymentSchema);
