const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const roomSchema = new Schema({
    hotelName: { type: String, required: true },
    roomNumber: { type: String, required: true },
    roomType: { type: String, enum: ['single', 'double', 'suite', 'deluxe'], required: true },
    description: { type: String },
    images: [{ type: String }],
    pricePerNight: { type: Number, required: true },
    size: { type: String },
    bedType: { type: String },
    view: { type: String },
    amenities: [{ type: String }],
    availability: { type: Boolean, default: true },
    maxGuests: { type: Number, required: true }
}, { timestamps: true });

module.exports = mongoose.model('Room', roomSchema);
