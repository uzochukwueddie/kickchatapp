const path = require('path');
const fs = require('fs');
const cloudinary = require('cloudinary');
const formidable = require('formidable')

cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.API_KEY,
    api_secret: process.env.API_SECRET
});




exports.addFile = (req, res) => {
    cloudinary.uploader.upload(req.body.file, function (resp) {
        return res.status(200).json({message: 'File added successfully', response: resp})
    });
    
}