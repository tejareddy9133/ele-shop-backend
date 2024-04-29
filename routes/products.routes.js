const express = require("express");
const { validationResult } = require("express-validator");
const multer = require("multer");
const { productModel } = require("../models/product.model");
const { adminauth } = require("../middleware/adminauth");

const productRouter = express.Router();

// File upload configuration
const upload = multer({ dest: "uploads/" });

// Validation middleware for create and update endpoints
const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};

// Create a new product
productRouter.post(
  "/create",
  adminauth,
  upload.single("image"),
  validate,
  async (req, res) => {
    try {
      const product = new productModel({
        title: req.body.title,
        price: req.body.price,
        description: req.body.description,
        category: req.body.category,
        image: req.file ? req.file.path : "",
        rating: req.body.rating,
        brand: req.body.brand,
        // Add additional fields if needed
      });
      await product.save();
      res.json({ msg: "Product created successfully", product });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
);

// Search for products
productRouter.get("/search", async (req, res) => {
  const { query } = req.query;
  try {
    const products = await productModel.find({
      $text: { $search: query },
    });
    res.json({ products });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Advanced filtering and pagination
productRouter.get("/products", async (req, res) => {
  const { page, limit, sortBy, sortOrder, ...filters } = req.query;
  const pageNumber = parseInt(page) || 1;
  const itemsPerPage = parseInt(limit) || 10;
  const sort = { [sortBy || "createdAt"]: sortOrder === "desc" ? -1 : 1 };
  const skip = (pageNumber - 1) * itemsPerPage;

  try {
    const query = productModel
      .find(filters)
      .sort(sort)
      .skip(skip)
      .limit(itemsPerPage);
    const products = await query.exec();
    const totalProducts = await productModel.countDocuments(filters);
    const totalPages = Math.ceil(totalProducts / itemsPerPage);

    res.json({
      products,
      currentPage: pageNumber,
      totalPages,
    });
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
});

// Get a single product by ID
productRouter.get("/product/:productId", async (req, res) => {
  const { productId } = req.params;
  try {
    const product = await productModel.findById(productId);
    if (product) {
      res.json({ product });
    } else {
      res.status(404).json({ msg: "Product not found" });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update a product
productRouter.patch("/update/:productId", adminauth, async (req, res) => {
  const { productId } = req.params;
  try {
    const product = await productModel.findByIdAndUpdate(
      productId,
      { $set: req.body },
      { new: true }
    );
    if (product) {
      res.json({ msg: "Product updated successfully", product });
    } else {
      res.status(404).json({ msg: "Product not found" });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Delete a product
productRouter.delete("/delete/:productId", adminauth, async (req, res) => {
  const { productId } = req.params;
  try {
    const product = await productModel.findByIdAndDelete(productId);
    if (product) {
      res.json({ msg: "Product deleted successfully" });
    } else {
      res.status(404).json({ msg: "Product not found" });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = { productRouter };
