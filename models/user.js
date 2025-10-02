const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

const Schema = mongoose.Schema;

const userSchema = new Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true, minlength: 6 },
    phone: { type: String },
    user_type: { type: String, enum: ['user', 'admin', 'super_admin'], default: 'user' },
    favorites: [{ type: Schema.Types.ObjectId, ref: 'Room' }],
    bookingHistory: [{ type: Schema.Types.ObjectId, ref: 'Booking' }],
    status: { type: String },
}, { timestamps: true });

userSchema.plugin(uniqueValidator);

module.exports = mongoose.model('User', userSchema);
