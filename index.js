const Facility = require("./models/Facility");
const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const mongoose = require("mongoose");
require("dotenv").config();

const app = express();
const port = process.env.PORT || 5000;

app.use(
  cors({
    origin: "http://localhost:3000",
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
  res.send("SportNest Server Running....");
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

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});