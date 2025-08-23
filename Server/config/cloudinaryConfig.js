const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
        folder: 'e-commerce-products', // Cloudinary में जिस फोल्डर में इमेज स्टोर करनी है
        format: async (req, file) => 'jpeg', // इमेज फॉर्मेट
        public_id: (req, file) => Date.now() + '-' + file.originalname,
    },
});

module.exports = { cloudinary, storage };