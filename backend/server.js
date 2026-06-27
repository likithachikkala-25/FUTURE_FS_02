const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());

/* =========================
   MONGOOSE CONNECTION
========================= */
mongoose.connect("mongodb+srv://admin:admin123@cluster0.syeac7o.mongodb.net/crm")
  .then(() => console.log("MongoDB Connected"))
  .catch(err => console.log("MongoDB Error:", err));

/* =========================
   SCHEMAS
========================= */

// Note Schema
const noteSchema = new mongoose.Schema({
  text: String,
  date: {
    type: Date,
    default: Date.now
  }
});

// Lead Schema
const leadSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  source: { type: String, required: true },
  status: {
    type: String,
    enum: ["new", "contacted", "converted"],
    default: "new"
  },
  notes: [noteSchema]
}, { versionKey: false });

const Lead = mongoose.model("Lead", leadSchema);

/* =========================
   TEST ROUTE
========================= */
app.get("/", (req, res) => {
  res.send("API Working 🚀");
});

/* =========================
   CREATE LEAD (FIXED)
========================= */
app.post("/leads", async (req, res) => {
  try {
    console.log("POST BODY:", req.body);

    const { name, email, source } = req.body;

    if (!name || !email || !source) {
      return res.status(400).json({
        message: "name, email, source are required"
      });
    }

    const lead = await Lead.create({
      name,
      email,
      source,
      status: "new",
      notes: []
    });

    return res.status(201).json(lead);

  } catch (err) {
    console.log("POST ERROR:", err);
    return res.status(500).json({ message: err.message });
  }
});

/* =========================
   GET LEADS
========================= */
app.get("/leads", async (req, res) => {
  try {
    const { status } = req.query;

    let filter = {};
    if (status) filter.status = status;

    const leads = await Lead.find(filter);
    res.json(leads);

  } catch (err) {
    console.log("GET ERROR:", err);
    res.status(500).json({ message: err.message });
  }
});

/* =========================
   UPDATE LEAD
========================= */
app.patch("/leads/:id", async (req, res) => {
  try {
    const updatedLead = await Lead.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    if (!updatedLead) {
      return res.status(404).json({ message: "Lead not found" });
    }

    res.json(updatedLead);

  } catch (err) {
    console.log("PATCH ERROR:", err);
    res.status(500).json({ message: err.message });
  }
});

/* =========================
   DELETE LEAD
========================= */
app.delete("/leads/:id", async (req, res) => {
  try {
    const deleted = await Lead.findByIdAndDelete(req.params.id);

    if (!deleted) {
      return res.status(404).json({ message: "Lead not found" });
    }

    res.json({ message: "Lead deleted successfully" });

  } catch (err) {
    console.log("DELETE ERROR:", err);
    res.status(500).json({ message: err.message });
  }
});

/* =========================
   ADD NOTE
========================= */
app.post("/leads/:id/notes", async (req, res) => {
  try {
    const lead = await Lead.findById(req.params.id);

    if (!lead) {
      return res.status(404).json({ message: "Lead not found" });
    }

    lead.notes.push({ text: req.body.text });

    await lead.save();

    res.json(lead);

  } catch (err) {
    console.log("NOTE ERROR:", err);
    res.status(500).json({ message: err.message });
  }
});

/* =========================
   START SERVER
========================= */
app.listen(5001, () => {
  console.log("Server running on port 5001");
});