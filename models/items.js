const mongoose = require("mongoose");
const { undefined } = require("webidl-conversions");
const Schema = mongoose.Schema;

const TotalItemsSchema = new Schema({
  image: String,
  name: String,
  category: String,
  price: Number,
  quantity: Number,
});

const TotalItems = new mongoose.model("totalItems", TotalItemsSchema);

module.exports = TotalItems;
