const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cors = require("cors");
const path = require("path");

const app = express();

app.use(cors());
app.use(bodyParser.json());

// ✅ MongoDB Atlas connection (update your own URI below)
mongoose.connect("mongodb+srv://admin:admin123@cluster0.xxxxx.mongodb.net/plant-manager")
  .then(() => console.log("✅ Connected to MongoDB Atlas"))
  .catch(err => console.error(err));

// ✅ Schema + Model
const plantSchema = new mongoose.Schema({
  name: String,
  type: String,
  price: Number,
});
const Plant = mongoose.model("Plant", plantSchema);

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

// ✅ Serve frontend (index.html)
app.use(express.static(path.join(__dirname)));

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
