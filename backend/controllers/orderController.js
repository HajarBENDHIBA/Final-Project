import Order from '../models/Order.js';
import Product from '../models/Product.js';

export const createOrder = async (req, res) => {
  try {
    const { items, total } = req.body;
    const userId = req.user.id;

    // Validate items
    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ message: 'Invalid items in order' });
    }

    // Validate total
    if (!total || isNaN(total) || total <= 0) {
      return res.status(400).json({ message: 'Invalid total amount' });
    }

    // Create order items with product references
    const orderItems = await Promise.all(items.map(async (item) => {
      const product = await Product.findById(item.id);
      if (!product) {
        throw new Error(`Product not found: ${item.id}`);
      }
      return {
        product: product._id,
        quantity: item.quantity,
        price: item.price
      };
    }));

    // Create the order
    const order = new Order({
      user: userId,
      items: orderItems,
      total
    });

    await order.save();

    // Clear the user's cart
    res.clearCookie('cart');

    res.status(201).json({
      message: 'Order created successfully',
      order: {
        _id: order._id,
        items: order.items,
        total: order.total,
        status: order.status,
        createdAt: order.createdAt
      }
    });
  } catch (error) {
    console.error('Error creating order:', error);
    res.status(500).json({ 
      message: 'Error creating order',
      error: error.message 
    });
  }
};

export const getOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user.id })
      .populate('items.product')
      .sort({ createdAt: -1 });

    res.json(orders);
  } catch (error) {
    console.error('Error fetching orders:', error);
    res.status(500).json({ message: 'Error fetching orders' });
  }
}; 