require('dotenv').config()
const cloudinary = require('cloudinary').v2;

exports.uploadFileOnCloudinary = async(file, folder, height, quality) => {
    try {
        if(!file || !folder){
            return null;
        }

        const options = {
            folder,
            resource_type:"auto"
        }

        if(height){
            options.height = height;
        }
        if(quality){
            options.quality = quality;
        }
            
        return await cloudinary.uploader.upload(file.tempFilePath, options);
        
    } catch (error) {
        console.log("Error while Uploading file on cloudinary", error);
        process.exit(1);
    }
}