const mongoose = require("mongoose");

const facilitySchema = new mongoose.Schema({
  name: String,
  facility_type: String,
  image: String,
  location: String,
  price_per_hour: Number,
  capacity: Number,
  available_slots: [String],
  description: String,
  owner_email: String,
  booking_count: {
    type: Number,
    default: 0,
  },
});

const Facility = mongoose.model("Facility", facilitySchema);

module.exports = Facility;