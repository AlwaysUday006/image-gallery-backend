const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const multer = require("multer");
const path = require("path");

const app = express();
app.use(cors());
app.use(express.json());
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// 1. MongoDB Connection
mongoose.connect("mongodb+srv://AlwaysUday006:tim3M@chin3@mygallerycluster.goplvwq.mongodb.net/?retryWrites=true&w=majority&appName=MyGalleryCluster")
  .then(() => console.log("✅ MongoDB connected"))
  .catch(err => console.log(err));

// 2. Schema and Model
const imageSchema = new mongoose.Schema({
  name: String,
  imageUrl: String,
  uploadedAt: { type: Date, default: Date.now }
});
const Image = mongoose.model("Image", imageSchema);

// 3. Multer Storage
const storage = multer.diskStorage({
  destination: "./uploads/",
  filename: (req, file, cb) => cb(null, Date.now() + path.extname(file.originalname))
});
const upload = multer({ storage });

// 4. Routes
app.get("/", (req, res) => res.send("Backend running!"));

app.post("/upload", upload.single("image"), async (req, res) => {
  const newImage = new Image({
    name: req.body.name,
    imageUrl: `http://localhost:5000/uploads/${req.file.filename}`
  });
  await newImage.save();
  res.json({ message: "Image uploaded successfully!" });
});

app.get("/images", async (req, res) => {
  const images = await Image.find().sort({ uploadedAt: -1 });
  res.json(images);
});

// 5. Listen on Port
app.listen(5000, () => console.log("🚀 Server running on http://localhost:5000"));
