const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const Video = require("./models/Video");

const app = express();
app.use(bodyParser.json());

mongoose.connect("mongodb://localhost:27017/podcast")
  .then(() => console.log("✅ MongoDB Connected"))
  .catch(err => console.log("❌ DB Error:", err));

app.post("/api/videos", async (req, res) => {
  try {
    const { title, description } = req.body;
    if (!title) {
      return res.status(400).json({ success: false, message: "Title is required!" });
    }
    const video = await Video.create({ title, description });
    res.status(201).json({ success: true, message: "Video added successfully!", data: video });
  } catch {
    res.status(500).json({ success: false, message: "Server Error" });
  }
});

app.get("/api/videos", async (req, res) => {
  const videos = await Video.find();
  res.status(200).json({ success: true, data: videos });
});

app.put("/api/videos/:id", async (req, res) => {
  try {
    const video = await Video.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!video) return res.status(404).json({ success: false, message: "Video not found!" });
    res.status(200).json({ success: true, message: "Video updated!", data: video });
  } catch {
    res.status(500).json({ success: false, message: "Server Error" });
  }
});

app.delete("/api/videos/:id", async (req, res) => {
  try {
    const video = await Video.findByIdAndDelete(req.params.id);
    if (!video) return res.status(404).json({ success: false, message: "Video not found!" });
    res.status(200).json({ success: true, message: "Video deleted!" });
  } catch {
    res.status(500).json({ success: false, message: "Server Error" });
  }
});

app.listen(5000, () => console.log("🚀 Server running on http://localhost:5000"));
