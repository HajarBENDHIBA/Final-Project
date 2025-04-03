// models/Product.js
import mongoose from 'mongoose';

const productSchema = mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    image: {
        type: String,
        required: true // The image URL will be stored here
    }
});

const Product = mongoose.model('Product', productSchema);

export default Product;
