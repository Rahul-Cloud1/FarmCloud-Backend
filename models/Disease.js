const mongoose = require('mongoose');

const diseaseSchema = new mongoose.Schema({
  crop: String,
  symptoms: [String],
  diseaseName: String,
  solution: String
});

module.exports = mongoose.model('Disease', diseaseSchema);
