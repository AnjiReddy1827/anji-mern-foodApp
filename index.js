const express = require("express");
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const OrderedItems = require("./models/addCart");
const TotalItems = require("./models/items");
const cors = require("cors");

const app = express();
app.use(express.json());
dotenv.config();
app.use(cors());
const mongoURL = process.env.MONGO_URL;

mongoose
  .connect(mongoURL)
  .then(() => {
    app.listen(4000, () => {
      console.log("server running in port 4000");
    });
  })
  .catch(() => {
    console.log("db not connected");
  });

app.get("/", (req, res) => {
  res.send("Welcome to the Anji API!");
});

app.post("/totalItems", async (req, res) => {
  try {
    TotalItems.create(req.body)
      .then((items) => res.json(items))
      .catch((err) => res.json(err));
  } catch (error) {
    console.log("post error", error);
    res
      .status(500)
      .json({ error: "An error occurred while adding to total items" });
  }
});

app.get("/items", async (req, res) => {
  try {
    const items = await TotalItems.find();
    res.json(items);
  } catch (error) {
    res
      .status(500)
      .json({ error: "An error occurred while fetching total items" });
  }
});

app.post("/addToCart", async (req, res) => {
  try {
    console.log(req.body);
    OrderedItems.create(req.body)
      .then((items) => res.json(items))
      .catch((err) => res.json(err));
  } catch (error) {
    console.log("post error", error);
    res.status(500).json({ error: "An error occurred while adding to cart" });
  }
});
app.get("/cartItems", async (req, res) => {
  try {
    const items = await OrderedItems.find();
    res.json(items);
  } catch (error) {
    console.log("get error", error);
    res.status(500).json({ error: "An error occurred while fetching items" });
  }
});

app.put("/updateQuantity/:id", async (req, res) => {
  const id = req.params.id;
  const { quantity } = req.body;

  try {
    if (quantity <= 0) {
      const result = await OrderedItems.findOneAndDelete({ id: id });

      if (result) {
        return res.json({ message: "Item removed from cart" });
      } else {
        return res.status(404).json({ error: "Item not found" });
      }
    } else {
      const updatedItem = await OrderedItems.findOneAndUpdate(
        { id: id },
        { $set: { quantity: quantity } },
        { new: true }
      );

      if (updatedItem) {
        return res.json(updatedItem);
      } else {
        return res.status(404).json({ error: "Item not found" });
      }
    }
  } catch (error) {
    res
      .status(500)
      .json({ error: "An error occurred while changing quantity" });
  }
});

app.delete("/itemsDelete/:id", async (req, res) => {
  const id = req.params.id;

  try {
    const deleteResult = await OrderedItems.deleteOne({ id: id });

    if (deleteResult.deletedCount > 0) {
      res.json({ message: "Item successfully deleted" });
    } else {
      res.status(404).json({ error: "Item not found" });
    }
  } catch (error) {
    res
      .status(500)
      .json({ error: "An error occurred while deleting the item" });
  }
});

app.get("/totalPrice", async (req, res) => {
  try {
    const total = await OrderedItems.aggregate([
      {
        $group: {
          _id: null,
          totalPrice: {
            $sum: { $multiply: ["$price", "$quantity"] },
          },
        },
      },
    ]);
    if (total.length > 0) {
      res.json({ totalPrice: total[0].totalPrice });
    } else {
      res.json({ totalPrice: 0 });
    }
  } catch (error) {
    res.status(500).json({ error: "An error occurred while total price API" });
  }
});

app.delete("/deleteAllItems", async (req, res) => {
  try {
    const response = await OrderedItems.deleteMany();
    if (response.deletedCount > 0) {
      res.json({ message: "Items successfully deleted" });
    } else {
      res.status(404).json({ error: "No items found to delete" });
    }
  } catch (error) {
    res
      .status(500)
      .json({ error: "An error occurred while deleting all items" });
  }
});
