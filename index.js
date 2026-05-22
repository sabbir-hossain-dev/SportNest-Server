const Facility = require("./models/Facility");
const Booking = require("./models/Booking");
const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const mongoose = require("mongoose");
require("dotenv").config();

const app = express();
const port = process.env.PORT || 5000;
const corsOrigins = process.env.CORS_ORIGINS
  ? process.env.CORS_ORIGINS.split(",").map((origin) => origin.trim()).filter(Boolean)
  : null;
let mongoConnectionPromise = null;

const connectMongo = async () => {
  if (mongoose.connection.readyState === 1) {
    return mongoose.connection;
  }

  if (!mongoConnectionPromise) {
    mongoConnectionPromise = mongoose.connect(process.env.MONGODB_URI);
  }

  return mongoConnectionPromise;
};

app.use(
  cors({
    origin: corsOrigins && corsOrigins.length > 0 ? corsOrigins : true,
    credentials: true,
  })
);

app.use(express.json());
app.use(cookieParser());

connectMongo()
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => console.log("MongoDB connection failed:", err));

app.get("/", (req, res) => {
  res.send("Server is Live.........");
});

app.get("/facilities", async (req, res) => {
  try {
    await connectMongo();
    const facilities = await Facility.find();
    res.send(facilities);
  } catch (error) {
    res.status(500).send({
      message: "Failed to fetch facilities",
      error: { name: error?.name, message: error?.message },
    });
  }
});

app.post("/facilities", async (req, res) => {
  try {
    await connectMongo();
    const newFacility = req.body;
    const facility = new Facility(newFacility);
    const savedFacility = await facility.save();
    res.send(savedFacility);
  } catch (error) {
    res.status(500).send({
      message: "Failed to add facility",
      error: { name: error?.name, message: error?.message },
    });
  }
});

app.post("/facilities/bulk", async (req, res) => {
  try {
    await connectMongo();
    const facilitiesData = req.body; 
    const savedFacilities = await Facility.insertMany(facilitiesData);
    res.status(201).send({
      message: `${savedFacilities.length} facilities added successfully!`,
      data: savedFacilities
    });
  } catch (error) {
    res.status(500).send({
      message: "Failed to add multiple facilities",
      error: { name: error?.name, message: error?.message },
    });
  }
});

app.post("/bookings", async (req, res) => {
  try {
    await connectMongo();
    const newBooking = new Booking(req.body);
    const savedBooking = await newBooking.save();
    res.status(201).send(savedBooking);
  } catch (error) {
    res.status(500).send({ message: "Booking failed", error: { name: error?.name, message: error?.message } });
  }
});

app.get("/bookings", async (req, res) => {
  try {
    await connectMongo();
    const email = req.query.email;
    const query = email ? { userEmail: email } : {}; 
    const bookings = await Booking.find(query);
    res.send(bookings);
  } catch (error) {
    res.status(500).send({ message: "Failed to fetch bookings", error: { name: error?.name, message: error?.message } });
  }
});

app.delete("/bookings/:id", async (req, res) => {
  try {
    await connectMongo();
    const id = req.params.id;
    const result = await Booking.findByIdAndDelete(id);
    
    if (!result) {
      return res.status(404).send({ message: "Booking not found" });
    }
    
    res.send({ message: "Booking deleted successfully", deletedId: id });
  } catch (error) {
    res.status(500).send({ message: "Failed to delete booking", error: { name: error?.name, message: error?.message } });
  }
});

if (process.env.NODE_ENV !== 'production') {
  app.listen(port, () => {
    console.log(`Server running on port ${port}`);
  });
}

module.exports = app;