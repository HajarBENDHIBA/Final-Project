// orderController.js
import Order from "../models/Order.js";

// Get orders for the logged-in user
const getOrders = async (req, res) => {
  try {
    const userId = req.user.id;  // Access the user ID from the token

    const orders = await Order.find({ user: userId }) // Find orders for the logged-in user
      .populate("products.productId"); // Populate product details

    if (!orders.length) {
      return res.status(404).json({ message: "No orders found" });
    }

    res.json(orders); // Return orders to the client
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error", error });
  }
};

// Create a new order
const createOrder = async (req, res) => {
  try {
    const { products, totalPrice, paymentDetails } = req.body;

    if (!products || !totalPrice || !paymentDetails) {
      return res.status(400).json({ message: 'Products, total price, and payment details are required.' });
    }

    const newOrder = new Order({
      user: req.user.id, // Associate the order with the logged-in user
      products,
      totalPrice,
      paymentDetails,
    });

    await newOrder.save();

    res.status(201).json({ message: 'Order created successfully', order: newOrder });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to create order' });
  }
};

// Delete an order by ID (only if it belongs to the logged-in user)
const deleteOrder = async (req, res) => {
  try {
    const order = await Order.findById(req.params.orderId);

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    if (order.user.toString() !== req.user.id) {  // Ensure the logged-in user is the owner
      return res.status(403).json({ message: "Not authorized to delete this order" });
    }

    await order.deleteOne();
    res.json({ message: "Order deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error", error });
  }
};

export { getOrders, createOrder, deleteOrder };
