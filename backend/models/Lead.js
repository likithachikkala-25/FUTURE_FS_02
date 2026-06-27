const mongoose = require("mongoose");

// Notes schema
const noteSchema = new mongoose.Schema({
  text: String,
  date: {
    type: Date,
    default: Date.now
  }
});

// Lead schema
const leadSchema = new mongoose.Schema({
  name: String,
  email: String,
  source: String,
  status: {
    type: String,
    enum: ["new", "contacted", "converted"],
    default: "new"
  },
  notes: [noteSchema]
},{ versionkey: false });

module.exports = mongoose.model("Lead", leadSchema);