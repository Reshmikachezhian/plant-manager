import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";

dotenv.config();
const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// Connect to MongoDB
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("✅ Connected to MongoDB Atlas"))
  .catch((err) => console.error("❌ MongoDB connection error:", err));

// Plant schema
const plantSchema = new mongoose.Schema({
  name: String,
  type: String,
  price: Number,
});

const Plant = mongoose.model("Plant", plantSchema);

// 🌿 Routes

// Root route
app.get("/", (req, res) => {
  res.send("Plant Manager API is running 🌱");
});

// Get all plants
app.get("/plants", async (req, res) => {
  try {
    const plants = await Plant.find();
    res.json(plants);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Add a new plant
app.post("/plants", async (req, res) => {
  try {
    const plant = new Plant(req.body);
    await plant.save();
    res.status(201).json(plant);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Delete a plant
app.delete("/plants/:id", async (req, res) => {
  try {
    await Plant.findByIdAndDelete(req.params.id);
    res.json({ message: "Plant deleted successfully" });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
