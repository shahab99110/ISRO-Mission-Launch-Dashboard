const mongoose = require("mongoose");
const planetSchema = new mongoose.Schema({
  keplerName: {
    type: String,
  },
});

module.exports = mongoose.model('Planet', planetSchema);