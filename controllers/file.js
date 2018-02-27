const path = require('path');
const fs = require('fs');
const cloudinary = require('cloudinary');
var multipart = require('connect-multiparty')();

cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.API_KEY,
    api_secret: process.env.API_SECRET
});


exports.addFile = (req, res) => {
    //console.log(req.body.file)
    cloudinary.uploader.upload(req.body.file, function (resp) {
        return res.status(200).json({message: 'File added successfully', response: resp})
    });
}