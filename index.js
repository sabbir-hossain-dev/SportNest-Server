const Facility = require("./models/Facility");
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

app.use(
  cors({
    origin: corsOrigins && corsOrigins.length > 0 ? corsOrigins : true,
    credentials: true,
  })
);

app.use(express.json());
app.use(cookieParser());

mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => console.log(err));

app.get("/", (req, res) => {
  res.send("Server is Live.........");
});

app.get("/facilities", async (req, res) => {
  try {
    const facilities = await Facility.find();
    res.send(facilities);
  } catch (error) {
    res.status(500).send({
      message: "Failed to fetch facilities",
      error,
    });
  }
});

app.post("/facilities", async (req, res) => {
  try {
    const newFacility = req.body;
    const facility = new Facility(newFacility);
    const savedFacility = await facility.save();
    res.send(savedFacility);
  } catch (error) {
    res.status(500).send({
      message: "Failed to add facility",
      error,
    });
  }
});

app.post("/facilities/bulk", async (req, res) => {
  try {
    const facilitiesData = req.body; 
    const savedFacilities = await Facility.insertMany(facilitiesData);
    res.status(201).send({
      message: `${savedFacilities.length} facilities added successfully!`,
      data: savedFacilities
    });
  } catch (error) {
    res.status(500).send({
      message: "Failed to add multiple facilities",
      error,
    });
  }
});

if (process.env.NODE_ENV !== 'production') {
  app.listen(port, () => {
    console.log(`Server running on port ${port}`);
  });
}

module.exports = app;