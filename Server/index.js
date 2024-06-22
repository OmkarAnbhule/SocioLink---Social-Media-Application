require('dotenv').config()
const express = require('express');
const app = express();
const cors = require("cors");
const fileUpload = require('express-fileupload')
app.use(express.json());
app.use(cors());
app.use(fileUpload({
	useTempFiles: true,
	tempFileDir: "/tmp/"
}));

const userRoute = require('./routes/user.route')
const postRoute = require('./routes/post.route')
const chatRoute = require('./routes/chat.route');
const mongoDb = require('./database/mongoDB');
const { cloudinaryDB } = require('./database/cloudinaryDB')
mongoDb()
cloudinaryDB()

app.get("/", (req, resp) => {
	resp.send("App is Working");
});

app.use('/api/v1/user', userRoute)
app.use('/api/v1/post', postRoute)
app.use('/api/v1/chat', chatRoute)




// const cv = require('opencv4nodejs');
//image-blur-effect
// const blur_storage = multer.memoryStorage();
// const blur_upload = multer({ storage: blur_storage });

// function processImageBuffer(inputBuffer) {
// 	const img = cv.imdecode(new Uint8Array(inputBuffer), cv.IMREAD_COLOR);
// 	const faceClassifier = new cv.CascadeClassifier(cv.HAAR_FRONTALFACE_ALT2);
// 	const grayImg = img.cvtColor(cv.COLOR_BGR2GRAY);
// 	const faces = faceClassifier.detectMultiScale(grayImg).objects;
// 	for (const rect of faces) {
// 	  const roi = img.getRegion(rect);
// 	  roi.blur(new cv.Size(25, 25));
// 	}
// 	const { buffer } = cv.imencode('.jpg', img);
// 	const processedImgBuffer = Buffer.from(buffer);

// 	return processedImgBuffer;
//   }
//   app.post('/blur_image', blur_upload.single('image'), (req, res) => {
// 	try {
// 	  const inputImageBuffer = req.file.buffer;
// 	  const processedImageBuffer = processImageBuffer(inputImageBuffer);

// 	  // Send the processed image buffer as a response
// 	  res.send({img:processedImageBuffer})
// 	} catch (error) {
// 	  console.error('Error processing image:', error);
// 	}
//   });


app.listen(5000, () => {
	console.log('app is listening at http://localhost:5000');
});