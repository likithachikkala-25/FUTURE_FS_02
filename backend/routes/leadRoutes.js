const express = require("express");
const router = express.Router();
const Lead = require("../models/Lead");

// CREATE lead
router.post("/", async (req, res) => {
  const lead = new Lead(req.body);
  await lead.save();
  res.json(lead);
});

// GET all leads
router.get("/", async (req, res) => {
  const leads = await Lead.find();
  res.json(leads);
});

// UPDATE status
router.put("/:id", async (req, res) => {
  const lead = await Lead.findByIdAndUpdate(
    req.params.id,
    { status: req.body.status },
    { new: true }
  );
  res.json(lead);
});

// ADD note
router.post("/:id/notes", async (req, res) => {
  const lead = await Lead.findById(req.params.id);
  lead.notes.push({ text: req.body.text });
  await lead.save();
  res.json(lead);
});

module.exports = router;