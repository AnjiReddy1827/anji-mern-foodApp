const mongoose = require("mongoose");

const OrderedItemsSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  price: { type: Number, required: true },
  quantity: { type: Number, required: true },
});

const OrderedItems = new mongoose.model("orderedItems", OrderedItemsSchema);

module.exports = OrderedItems;
