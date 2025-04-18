import Product from "../models/Product.js";
import path from "path";

// Simple in-memory cache
let productsCache = null;
let lastCacheTime = null;
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes in milliseconds
const QUERY_TIMEOUT = 15000; // 15 seconds timeout

// Get all products
export const getProducts = async (req, res) => {
  try {
    // Check if we have cached data that's still valid
    const now = Date.now();
    if (
      productsCache &&
      lastCacheTime &&
      now - lastCacheTime < CACHE_DURATION
    ) {
      console.log("Serving products from cache");
      return res.json(productsCache);
    }

    // Set a timeout for the database query
    const timeoutPromise = new Promise((_, reject) => {
      setTimeout(() => reject(new Error("Database query timed out")), QUERY_TIMEOUT);
    });

    console.log("Attempting to fetch products from database...");

    // Race between the actual query and the timeout
    const products = await Promise.race([
      Product.find()
        .lean()
        .limit(20)
        .maxTimeMS(QUERY_TIMEOUT), // Add MongoDB native timeout
      timeoutPromise,
    ]);

    console.log(`Successfully fetched ${products.length} products`);

    // Update cache
    productsCache = products;
    lastCacheTime = now;

    res.json(products);
  } catch (error) {
    console.error("Error fetching products:", {
      error: error.message,
      stack: error.stack,
      name: error.name,
      code: error.code
    });

    // If we have cached data, return it even if it's expired
    if (productsCache) {
      console.log("Database error, serving stale cached data");
      return res.json(productsCache);
    }

    // If it's a timeout error, return a more specific message
    if (error.message === "Database query timed out" || error.name === "MongoTimeoutError") {
      return res.status(504).json({
        message: "The server is experiencing high load. Please try again in a few moments.",
        error: "GATEWAY_TIMEOUT",
        retryAfter: 30 // Suggest retry after 30 seconds
      });
    }

    res.status(500).json({
      message: "An error occurred while fetching products",
      error: error.message,
      retryAfter: 60 // Suggest retry after 60 seconds for other errors
    });
  }
};

// Add a new product
export const addProduct = async (req, res) => {
  console.log("Received product data:", {
    ...req.body,
    image: req.body.image ? 'base64 image data' : 'no image'
  });

  const { name, description, price, image } = req.body;

  try {
    // Validate all required fields
    if (!name || !description || !price || !image) {
      console.log("Missing fields:", { name, description, price, image: !!image });
      return res.status(400).json({
        message: "All fields are required",
        missingFields: {
          name: !name,
          description: !description,
          price: !price,
          image: !image,
        },
      });
    }

    // Validate price is a valid number
    const parsedPrice = parseFloat(price);
    if (isNaN(parsedPrice) || parsedPrice <= 0) {
      return res.status(400).json({
        message: "Price must be a valid positive number",
        receivedPrice: price,
      });
    }

    // Validate image is a valid base64 string
    if (!image.startsWith("data:image/")) {
      console.log("Invalid image format received:", image.substring(0, 50) + "...");
      return res.status(400).json({
        message: "Invalid image format. Please upload a valid image file.",
        receivedImage: image.substring(0, 50) + "..."
      });
    }

    // Create a new product with a unique ID
    const newProduct = new Product({
      name: name.trim(),
      description: description.trim(),
      price: parsedPrice,
      image: image,
      id: Date.now(), // Add a unique ID
    });

    console.log("Saving product:", {
      ...newProduct.toObject(),
      image: 'base64 image data'
    });

    const savedProduct = await newProduct.save();
    console.log("Product saved successfully:", {
      ...savedProduct.toObject(),
      image: 'base64 image data'
    });

    // Invalidate cache when a new product is added
    productsCache = null;
    lastCacheTime = null;

    res.status(201).json(savedProduct);
  } catch (error) {
    console.error("Detailed error saving product:", {
      message: error.message,
      stack: error.stack,
      name: error.name,
      code: error.code
    });

    // Send more detailed error information
    res.status(500).json({
      message: "Error adding product",
      error: error.message,
      details: {
        name: error.name,
        code: error.code
      }
    });
  }
};

// Delete a product
export const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: "Product not found" });

    await product.deleteOne();

    // Invalidate cache when a product is deleted
    productsCache = null;
    lastCacheTime = null;

    res.json({ message: "Product deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update a product
export const updateProduct = async (req, res) => {
  const { id } = req.params;
  const { name, description, price, image } = req.body;

  console.log("Update request received:", {
    id,
    name,
    description,
    price,
    image,
  });

  try {
    // First check if the product exists
    const existingProduct = await Product.findById(id);
    if (!existingProduct) {
      console.log("Product not found with ID:", id);
      return res.status(404).json({ message: "Product not found" });
    }

    // Validate all required fields
    if (!name || !description || !price) {
      return res.status(400).json({
        message: "All fields are required",
        missingFields: {
          name: !name,
          description: !description,
          price: !price,
        },
      });
    }

    // Validate price is a valid number
    const parsedPrice = parseFloat(price);
    if (isNaN(parsedPrice) || parsedPrice <= 0) {
      return res.status(400).json({
        message: "Price must be a valid positive number",
        receivedPrice: price,
      });
    }

    // Prepare update data
    const updateData = {
      name: name.trim(),
      description: description.trim(),
      price: parsedPrice,
    };

    // Only update image if a new one is provided
    if (image) {
      updateData.image = image;
    }

    console.log("Updating product with data:", updateData);

    const updatedProduct = await Product.findByIdAndUpdate(
      id,
      updateData,
      { new: true } // Return the updated document
    );

    if (!updatedProduct) {
      console.log("Failed to update product with ID:", id);
      return res.status(404).json({ message: "Product not found" });
    }

    // Invalidate cache when a product is updated
    productsCache = null;
    lastCacheTime = null;

    console.log("Product updated successfully:", updatedProduct);
    res.json(updatedProduct);
  } catch (error) {
    console.error("Error updating product:", error);
    res.status(500).json({
      message: "Error updating product",
      error: error.message,
      stack: error.stack,
    });
  }
};
