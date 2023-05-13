const multer = require('multer')
const stream = require('stream');
const cloudinary = require('cloudinary');

if (!process.env.CLOUDINARY_URL) {
    console.error('*******************************************************************************')
    console.error('*******************************************************************************\n')
    console.error('You must set the CLOUDINARY_URL environment variable for Cloudinary to function\n')
    console.error('\texport CLOUDINARY_URL="cloudinary:// get value from heroku"\n')
    console.error('*******************************************************************************')
    console.error('*******************************************************************************')
    process.exit(1)
}

const doUpload = (title, req, res, next) => {
    if (!req.file) {
        next();
        return;
    }
    const uploadStream = cloudinary.uploader.upload_stream(result => {
        req.fileurl = result.url;
        req.fileid = result.public_id;
        next()
    }, {public_id: `${req.userName}-${title}-${Date.now()}`})
    const s = new stream.PassThrough()
    s.end(req.file.buffer)
    s.pipe(uploadStream)
    s.on('end', uploadStream.end)
}

const uploadImage = (title) => (req, res, next) => 
    multer().single('image')(req, res, () => doUpload(title, req, res, next));

module.exports = uploadImage;