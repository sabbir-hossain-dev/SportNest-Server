const mongoose = require("mongoose");

const bookingSchema = new mongoose.Schema({
  facilityId: { type: mongoose.Schema.Types.ObjectId, ref: "Facility", required: true },
  facilityName: { type: String, required: true },
  userEmail: { type: String, required: true, lowercase: true },
  bookingDate: { type: String, required: true },
  slot: { type: String, required: true },
  price: { type: Number, required: true },
  status: { type: String, default: "Pending" }
}, { timestamps: true });

module.exports = mongoose.model("Booking", bookingSchema);