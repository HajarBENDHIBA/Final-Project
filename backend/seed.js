import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Product from './models/Product.js';

dotenv.config();

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => console.log("✅ MongoDB Connected"))
  .catch(error => console.error("❌ MongoDB Connection Failed:", error));

// Plant Products Data
const plants = [
  { name: 'Monstera Deliciosa', description: 'A tropical beauty with large, split leaves.', image: '/plants/monstera.jpg', price: 360 },
  { name: 'Snake Plant', description: 'Low-maintenance and air-purifying.', image: '/plants/snake-plant.jpg', price: 80 },
  { name: 'Fiddle Leaf Fig', description: 'Elegant and perfect for indoors.', image: '/plants/fiddle-leaf.jpg', price: 130 },
  { name: 'Peace Lily', description: 'Brings peace and purifies air.', image: '/plants/peace-lily.jpg', price: 150 },
  { name: 'Aloe Vera', description: 'Soothing and easy to care for.', image: '/plants/aloe-vera.jpg', price: 110 },
  { name: 'Spider Plant', description: 'Hardy and great for beginners.', image: '/plants/spider-plant.jpg', price: 50 },
  { name: 'ZZ Plant', description: 'Thrives in low light conditions.', image: '/plants/zz-plant.jpg', price: 160 },
  { name: 'Areca Palm', description: 'A graceful palm with feathery green fronds.', image: '/plants/areca-palm.jpg', price: 450 },
  { name: 'Rubber Plant', description: 'Deep green glossy leaves.', image: '/plants/rubber-plant.jpg', price: 280 },
  { name: 'Calathea', description: 'Unique leaf patterns.', image: '/plants/calathea.jpg', price: 90 },
  { name: 'Cactus', description: 'Drought-resistant and stylish.', image: '/plants/cactus.jpg', price: 40 },
  { name: 'Pothos', description: 'Fast-growing and beautiful vines.', image: '/plants/pothos.jpg', price: 170 },
];

// Function to insert data
const seedProducts = async () => {
  try {
    await Product.deleteMany(); // Clear existing products (optional)
    await Product.insertMany(plants);
    console.log('✅ Products added successfully!');
    mongoose.connection.close();
  } catch (error) {
    console.error('❌ Error seeding products:', error);
    mongoose.connection.close();
  }
};

seedProducts();
