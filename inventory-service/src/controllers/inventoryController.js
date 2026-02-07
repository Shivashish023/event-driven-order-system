import { Inventory } from "../models/inventoryModel.js";

const createProduct = async (req, res) => {
  try {
    const product = await Inventory.create(req.body);
    console.log("Product added to inventory:",product);
    res.status(201).json(product);
  } catch (err) {
    console.error("Error creating product:", err);
    res
      .status(500)
      .json({ error: "Product creation failed", details: err.message });
  }
};


const getAllProducts = async (req, res) => {
  try {
    const products = await Inventory.find();
    res.status(200).json(products);
  } catch (err) {
    console.error("Error fetching products:", err);
    res.status(500).json({ error: "Fetching products failed", details: err.message });
  }
};


const getProductById = async (req, res) => {
  try {
    const { productId } = req.params;
    const product = await Inventory.findOne({ productId });

    if (!product) {
      return res.status(404).json({ error: "Product not found" });
    }

    res.status(200).json(product);
  } catch (err) {
    console.error("Error fetching product:", err);
    res
      .status(500)
      .json({ error: "Fetching product failed", details: err.message });
  }
};


const updateProduct = async (req, res) => {
  try {
    const { productId } = req.params;
    const updates = req.body;

    const updatedProduct = await Inventory.findOneAndUpdate(
      { productId },
      updates,
      { new: true }
    );

    if (!updatedProduct) {
      return res.status(404).json({ error: "Product not found" });
    }

    res.status(200).json(updatedProduct);
  } catch (err) {
    console.error("Error updating product:", err);
    res.status(500).json({ error: "Updating product failed", details: err.message });
  }
};


const deleteProduct = async (req, res) => {
  try {
    const { productId } = req.params;

    const deleted = await Inventory.findOneAndDelete({ productId });

    if (!deleted) {
      return res.status(404).json({ error: "Product not found" });
    }

    res.status(200).json({ message: "Product deleted successfully" });
  } catch (err) {
    console.error("Error deleting product:", err);
    res
      .status(500)
      .json({ error: "Deleting product failed", details: err.message });
  }
};

export {createProduct, getAllProducts, getProductById, updateProduct, deleteProduct};