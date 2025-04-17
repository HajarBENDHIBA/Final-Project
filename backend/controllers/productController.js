import Product from "../models/Product.js";
import path from "path";

// Get all products
export const getProducts = async (req, res) => {
  try {
    // Set a timeout for the database query
    const timeoutPromise = new Promise((_, reject) => {
      setTimeout(() => reject(new Error("Database query timed out")), 5000);
    });

    // Race between the actual query and the timeout
    const products = await Promise.race([
      Product.find().lean().limit(20), // Use lean() for better performance and limit results
      timeoutPromise,
    ]);

    res.json(products);
  } catch (error) {
    console.error("Error fetching products:", error);
    // If it's a timeout error, return a more specific message
    if (error.message === "Database query timed out") {
      return res.status(504).json({
        message: "Request timed out. Please try again later.",
        error: "GATEWAY_TIMEOUT",
      });
    }
    res.status(500).json({ message: error.message });
  }
};

// Add a new product
export const addProduct = async (req, res) => {
  console.log("Received product data:", req.body);

  const { name, description, price, image } = req.body;

  try {
    // Validate all required fields
    if (!name || !description || !price || !image) {
      console.log("Missing fields:", { name, description, price, image });
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
      return res.status(400).json({
        message: "Invalid image format. Please upload a valid image file.",
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

    console.log("Saving product:", newProduct);
    const savedProduct = await newProduct.save();
    console.log("Product saved successfully:", savedProduct);

    res.status(201).json(savedProduct);
  } catch (error) {
    console.error("Detailed error saving product:", error);
    // Send more detailed error information
    res.status(500).json({
      message: "Error adding product",
      error: error.message,
      stack: error.stack,
      name: error.name,
    });
  }
};

// Delete a product
export const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: "Product not found" });

    await product.deleteOne();
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
