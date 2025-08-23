const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Product = require('./models/Product');

dotenv.config();

const MONGO_URI = process.env.MONGO_URI;

const sampleProducts = [
  {
    title: 'Wireless Mouse',
    description: 'Ergonomic wireless mouse with USB receiver',
    price: 599,
    originalPrice: 999,
    image: 'https://m.media-amazon.com/images/I/61LtuGzXeaL._SL1500_.jpg',
  },
  {
    title: 'Gaming Keyboard',
    description: 'RGB mechanical keyboard with blue switches',
    price: 1499,
    originalPrice: 2299,
    image: 'https://media.istockphoto.com/id/1396231106/photo/gaming-keyboard-with-backlight.webp?a=1&b=1&s=612x612&w=0&k=20&c=gZ7lNiJPj6kXPclzFNOKG82LmejcizOj3DC8D-jB9HQ=',
  },
  {
    title: 'HD Monitor',
    description: '24-inch full HD monitor with HDMI support',
    price: 7499,
    originalPrice: 9999,
    image: 'https://media.istockphoto.com/id/638043774/photo/modern-curved-4k-ultrahd-tv.webp?a=1&b=1&s=612x612&w=0&k=20&c=qaTtJEO2xV8VQltAAMD7qiw9ce52AjmYga85HjOzzlw=',
  },
  {
    title: 'Bluetooth Headphones',
    description: 'Wireless over-ear headphones with noise cancellation',
    price: 2999,
    originalPrice: 4999,
    image: 'https://media.istockphoto.com/id/1413198242/photo/blue-headphone-images-on-white-background.webp?a=1&b=1&s=612x612&w=0&k=20&c=wT6rL37dOjb4fs0npuG831EbMRYve0YQZFzmkHtnLl0=',
  },
];


mongoose.connect(MONGO_URI)
  .then(async () => {
    console.log('✅ MongoDB connected...');
    await Product.deleteMany(); // Clears old data
    await Product.insertMany(sampleProducts);
    console.log('🌱 Sample products inserted!');
    mongoose.disconnect();
  })
  .catch(err => console.error('❌ Error inserting data:', err));
