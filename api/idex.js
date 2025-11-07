import express from "express";
import mongoose from "mongoose";
import bodyParser from "body-parser";
import cors from "cors";

// Initialize Express app
const app = express();
app.use(cors());
app.use(bodyParser.json());

// ✅ Connect to MongoDB Atlas (update with your URI)
const MONGO_URI = "mongodb+srv://admin:admin123@cluster0.xxxxx.mongodb.net/plant-manager";

if (!mongoose.connection.readyState) {
  mongoose.connect(MONGO_URI)
    .then(() => console.log("✅ Connected to MongoDB Atlas"))
    .catch((err) => console.error("MongoDB connection error:", err));
}

// ✅ Define Plant Schema and Model
const plantSchema = new mongoose.Schema({
  name: String,
  type: String,
  price: Number,
});

const Plant = mongoose.models.Plant || mongoose.model("Plant", plantSchema);

// ✅ API Routes
app.get("/api/plants", async (req, res) => {
  const plants = await Plant.find();
  res.json(plants);
});

app.post("/api/plants", async (req, res) => {
  const plant = new Plant(req.body);
  await plant.save();
  res.status(201).json(plant);
});

app.delete("/api/plants/:id", async (req, res) => {
  await Plant.findByIdAndDelete(req.params.id);
  res.json({ message: "Plant deleted successfully" });
});

// ✅ Export for Vercel Serverless
export default app;
