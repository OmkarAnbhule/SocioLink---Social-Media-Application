require('dotenv').config()
const http = require("http");
const websocketServer = require("websocket").server
const httpServer = http.createServer();
const express = require('express');
const app = express();
const cors = require("cors");
app.use(express.json());
app.use(cors());


const userRoute = require('./routes/user.route')
const postRoute = require('./routes/post.route')
const mongoDb = require('./database/mongoDB');

mongoDb()

app.get("/", (req, resp) => {
	resp.send("App is Working");
});
app.use('/api/v1/auth', userRoute)
app.use('/api/v1/post', postRoute)




// const cv = require('opencv4nodejs');
httpServer.listen(9000, () => console.log("http server listening on port 9000"))
const clients = {}
const wsServer = new websocketServer({
	"httpServer": httpServer
})
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
wsServer.on("request", request => {
	//connect
	const connection = request.accept(null, request.origin);
	connection.on("open", () => console.log("opened!"))
	connection.on("close", () => console.log("closed!"))
	connection.on("message", message => {
		const result = JSON.parse(message.utf8Data)
		if (result.method == 'login') {
			const id = result.clientId;
		}
	})
	const clientId = guid();
	clients[clientId] = {
		"connection": connection
	}
	const payLoad = {
		"method": "connect",
		"clientId": clientId
	}
	connection.send(JSON.stringify(payLoad))
})

app.listen(5000 , ()=>{
	console.log('app is listening at http://localhost:5000');
});