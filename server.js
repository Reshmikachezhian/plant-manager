const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cors = require("cors");

const app = express();

// Middleware
app.use(bodyParser.json());
app.use(cors());

// ✅ Connect to MongoDB
mongoose.connect("mongodb://127.0.0.1:27017/plant-manager", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => console.log("✅ Connected to MongoDB"))
  .catch((err) => console.error("❌ MongoDB connection error:", err));

// ✅ Define Schema
const plantSchema = new mongoose.Schema({
  name: String,
  type: String,
  price: Number,
});

// ✅ Create Model
const Plant = mongoose.model("Plant", plantSchema);

// ✅ ROUTES

// 1️⃣ Get all plants
app.get("/plants", async (req, res) => {
  try {
    const plants = await Plant.find();
    res.json(plants);
  } catch (err) {
    res.status(500).send(err.message);
  }
});

// 2️⃣ Add a new plant
app.post("/plants", async (req, res) => {
  try {
    const plant = new Plant(req.body);
    await plant.save();
    res.status(201).json(plant);
  } catch (err) {
    res.status(400).send(err.message);
  }
});

// 3️⃣ Update a plant
app.put("/plants/:id", async (req, res) => {
  try {
    const updatedPlant = await Plant.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updatedPlant);
  } catch (err) {
    res.status(400).send(err.message);
  }
});

// 4️⃣ Delete a plant
app.delete("/plants/:id", async (req, res) => {
  try {
    await Plant.findByIdAndDelete(req.params.id);
    res.json({ message: "Plant deleted successfully" });
  } catch (err) {
    res.status(400).send(err.message);
  }
});

// 5️⃣ Place an order (simple example)
app.post("/order", (req, res) => {
  const { plantName, quantity } = req.body;
  res.json({ message: `Order placed for ${quantity} x ${plantName}` });
});

// ✅ Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
