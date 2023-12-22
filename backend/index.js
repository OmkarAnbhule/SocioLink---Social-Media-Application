// To connect with your mongoDB database
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const http = require("http");
const otpGenerator = require('otp-generator');
console.log(mongoose.connect('mongodb://127.0.0.1:27017/Sociolink'));
const OTP = require('./otp/models/otp_model');
const accountSid = "AC8d3462249d6464aaae2e656f66abd0df";
const authToken = "48a7f4dd3ff30903c2af050bcb054555";
const verifySid = "VA88e0afaa311f9bcbce64943219a727c8";
const client = require("twilio")(accountSid, authToken);
const websocketServer = require("websocket").server
const httpServer = http.createServer();
const multer = require('multer')
const fs = require('fs')
httpServer.listen(9000, () => console.log("http server listening on port 9000"))
const clients = {}
const wsServer = new websocketServer({
	"httpServer": httpServer
})
function S4() {
	return (((1 + Math.random()) * 0x10000) | 0).toString(32).substring(1);
}
const guid = () => (S4() + S4() + "-" + S4() + "-4" + S4());


const UserSchema = new mongoose.Schema({
	email: {
		type: String,
		required: true,
		unique: true,
	},
	name: {
		type: String,
		required: true,
	},
	password: {
		type: String,
		required: true,
	},
	username: {
		type: String,
		required: true,
		unique: true
	},
	date: {
		type: Date,
		default: Date.now,
	},
});
const logUsers = new mongoose.Schema({
	log_id: {
		type: String,
		required: true,
		unique: true,
	},
	date: {
		type: Date,
		default: Date.now,
	}
});
const profileImage = new mongoose.Schema({
	email: {
		type: String,
		required: true,
		unique: true
	},
	image: {
		type: String,
		unique: true
	}
})
const Log = mongoose.model('Login', logUsers)
const User = mongoose.model('User', UserSchema);
const profile_img = mongoose.model('Profile_Img', profileImage)
User.createIndexes();
Log.createIndexes();

// For backend and express
const express = require('express');
const app = express();
const cors = require("cors");
const { ConnectionClosedEvent } = require('mongodb');
console.log("App listen at port 5000");
app.use(express.json());
app.use(cors());
app.get("/", (req, resp) => {
	resp.send("App is Working");
});
// send otp when registered
app.post("/register", async (req, resp) => {
	const { email } = req.body;
	let otp = otpGenerator.generate(6, {
		upperCaseAlphabets: false,
		lowerCaseAlphabets: false,
		specialChars: false,
	});
	let result = await OTP.findOne({ otp: otp });
	while (result) {
		otp = otpGenerator.generate(6, {
			upperCaseAlphabets: false,
		});
		result = await OTP.findOne({ otp: otp });
	}
	const otpBody = await OTP.create({ email, otp });
	resp.send({ Response: 'Success' })
});
//register otp verfiy - email
app.post('/otp', async (req, resp) => {
	try {
		console.log('ok')
		const { email, name, password, username, otp } = req.body;
		const response = await OTP.find({ email }).sort({ createdAt: -1 }).limit(1);
		if (response.length === 0 || otp !== response[0].otp) {
			resp.send({ Response: 'Invalid' })
		}
		let hashedPassword;
		try {
			hashedPassword = await bcrypt.hash(password, 10);
			console.log(hashedPassword)
		} catch (error) {
		}
		const user = await User.create({ email, name, password: hashedPassword, username });
		let result = await user.save();
		console.log(result)
		result = result.toObject();
		if (result) {
			delete result.password;
			resp.send({ Response: "Success" });
			console.log(result);
		}
		else {
			resp.send({ Response: "something went wrong" });
		}
	}
	catch (e) {

	}
})
// login otp verify -email
app.post('/otp_login', async (req, resp) => {
	console.log('otp_login')
	const { log_id, otp } = req.body;
	const response = await OTP.find({ email: log_id }).sort({ createdAt: -1 }).limit(1);
	if (response.length === 0 || otp !== response[0].otp) {
		resp.send({ Response: 'Invalid' })
	} else {
		try {
			const user = await Log.create({ log_id });
			let result = await user.save();
			console.log(result)
			result = result.toObject();
			if (result) {
				delete result.password;
				resp.send({ Response: "Success" });
				console.log(result);
			}
			else {
				resp.send({ Response: "something went wrong" });
			}
		}
		catch (e) {
			console.log(e)
		}
	}
})
// login otp verify - sms
app.post('/otp_login_sms', async (req, resp) => {
	const { log_id, otp } = req.body;
	try {
		try {
			const verify = await client.verify.v2
				.services(verifySid)
				.verificationChecks.create({ to: `+91${log_id}`, code: otp })
			if (!verify) {
				resp.send({ Response: 'Invalid' })
			}
		}
		catch (e) {
		}
		try {
			const user = await Log.create({ log_id });
			let result = await user.save();
			console.log(result)
			result = result.toObject();
			if (result) {
				delete result.password;
				resp.send({ Response: "Success" });
				console.log(result);
			}
			else {
				resp.send({ Response: "something went wrong" });
			}
		}
		catch (e) {
			console.log(e)
		}
	}
	catch (e) {

	}

})
// verify duplicate username
app.post("/user_verify", async (req, resp) => {
	try {
		const { Username } = req.body;
		const username = Username;
		const existingUser1 = await User.findOne({ username });
		if (existingUser1) {
			resp.send({ Response: 'Failed' })
		}
		else {
			resp.send({ Response: 'Success' })
		}
	}
	catch (e) {
		resp.send({ Response: 'wrong' })
	}
})
//verify duplicate emailID , Phone Number
app.post("/email_valid", async (req, resp) => {
	try {
		const { Email } = req.body;
		const email = Email;
		const existingUser2 = await User.findOne({ email });
		if (existingUser2) {
			resp.send({ Response: 'Failed' })
		}
		else {
			resp.send({ Response: 'Success' })
		}
	}
	catch (e) {
		resp.send({ Respond: 'wrong' })
	}
})
// api to send sms for register 
app.post("/sms", async (req, resp) => {
	const { email } = req.body
	try {
		const otpResponse = await client.verify.v2
			.services(verifySid)
			.verifications.create({ to: `+91${email}`, channel: "sms" })
		resp.send({ Response: 'Success' });
		console.log(otpResponse)
	}
	catch (e) {
		console.log(e)
		resp.send({ Response: 'Failed' })
	}
})
//register otp verify -sms
app.post('/otp_sms', async (req, resp) => {
	const { email, name, password, username, otp } = req.body;
	try {
		try {
			const verify = await client.verify.v2
				.services(verifySid)
				.verificationChecks.create({ to: `+91${email}`, code: otp })
			if (!verify) {
				resp.send({ Response: 'Invalid' })
			}
		}
		catch (e) {
		}
		let hashedPassword;
		try {
			hashedPassword = await bcrypt.hash(password, 10);
			console.log(hashedPassword)
		} catch (error) {
		}
		const user = await User.create({ email, name, password: hashedPassword, username });
		let result = await user.save();
		console.log(result)
		result = result.toObject();
		if (result) {
			delete result.password;
			resp.send({ Response: "Success" });
			console.log(result);
		}
		else {
			resp.send({ Response: "something went wrong" });
		}
	}
	catch (e) {

	}

})
// login otp send - email
app.post('/login', async (req, resp) => {
	try {
		console.log('run')
		const { text, password, val } = req.body;
		let existingUser;
		if (val == 'email') {
			existingUser = await User.findOne({ email: text });
		}
		else {
			if (val == 'username') {
				existingUser = await User.findOne({ username: text });
			}
			else {
				if (val == 'number') {
					existingUser = await User.findOne({ email: text });
				}
			}
		}
		if (existingUser) {
			result = await bcrypt.compare(password, existingUser.password);
			if (result) {

				let otp = otpGenerator.generate(6, {
					upperCaseAlphabets: false,
					lowerCaseAlphabets: false,
					specialChars: false,
				});
				let result = await OTP.findOne({ otp: otp });
				while (result) {
					otp = otpGenerator.generate(6, {
						upperCaseAlphabets: false,
					});
					result = await OTP.findOne({ otp: otp });
				}
				const otpBody = await OTP.create({ email: existingUser.email, otp });
				resp.send({ Response: 'Success', email: existingUser.email })
			}
			else {
				resp.send({ Response: 'Incorrect' })
			}
		}
		else {
			resp.send({ Response: 'NF' })
		}
	}
	catch (e) {
		console.log(e)
	}
})
//Login otp send - sms
app.post('/login_sms', async (req, resp) => {
	const { text, val, password } = req.body;
	try {
		let existingUser;
		if (val == 'email') {
			existingUser = await User.findOne({ email: text });
		}
		else {
			if (val == 'username') {
				existingUser = await User.findOne({ username: text });
			}
			else {
				if (val == 'number') {
					existingUser = await User.findOne({ email: text });
				}
			}
		}
		if (existingUser) {
			result = await bcrypt.compare(password, existingUser.password);
			if (result) {
				const otpResponse = await client.verify.v2
					.services(verifySid)
					.verifications.create({ to: `+91${text}`, channel: "sms" })
				resp.send({ Response: 'Success', email: existingUser.email });
				console.log(otpResponse)
			}
			else {
				resp.send({ Response: 'Incorrect' })
			}
		}
		else {
			resp.send({ Response: 'NF' })
		}
	}
	catch (e) {
		console.log(e)
	}
})
// forgot password otp send
app.post('/forgot_password_otp', async (req, resp) => {
	try {
		const { text, val } = req.body
		let existingUser;
		if (val == 'email' || val == 'username') {
			existingUser = await User.findOne({ email: text });
			if (existingUser) {
				let otp = otpGenerator.generate(6, {
					upperCaseAlphabets: false,
					lowerCaseAlphabets: false,
					specialChars: false,
				});
				let result = await OTP.findOne({ otp: otp });
				while (result) {
					otp = otpGenerator.generate(6, {
						upperCaseAlphabets: false,
					});
					result = await OTP.findOne({ otp: otp });
				}
				const otpBody = await OTP.create({ email: existingUser.email, otp });
				resp.send({ Response: 'Success', email: existingUser.email })
			}
			else {
				resp.send({ Response: 'NF' })
			}
		}
		else {
			if (val == 'number') {
				existingUser = await User.findOne({ email: text });
				if (existingUser) {
					const otpResponse = await client.verify.v2
						.services(verifySid)
						.verifications.create({ to: `+91${log_id}`, channel: "sms" })
					resp.send({ Response: 'Success', email: existingUser.email });
					console.log(otpResponse)
				}
				else {
					resp.send({ Response: 'NF' })
				}
			}
		}
	}
	catch (e) {
		console.log(e)
	}
})

//forgot password otp verfiy - email
app.post('/validate_otp', async (req, resp) => {
	const { val, text, otp } = req.body
	if (val == 'email' || val == 'username') {
		const response = await OTP.find({ email: text }).sort({ createdAt: -1 }).limit(1);
		if (response.length === 0 || otp !== response[0].otp) {
			resp.send({ Response: 'Invalid' })
		}
		else {
			resp.send({ Response: 'Success' })
		}
	}
	else {
		if (val == 'number') {
			try {
				const verify = await client.verify.v2
					.services(verifySid)
					.verificationChecks.create({ to: `+91${text}`, code: otp })
				if (!verify) {
					resp.send({ Response: 'Invalid' })
				}
				resp.send({ Response: 'Success' })
			}
			catch (e) {
			}
		}
	}
})

// forgot password --> reset password 
app.post('/reset_password', async (req, resp) => {
	try {
		let hashedPassword
		const { password, text } = req.body;
		hashedPassword = await bcrypt.hash(password, 10);
		response = await User.findOneAndUpdate({ email: text }, { password: hashedPassword }, { new: true })
		if (response) {
			resp.send({ Response: 'Success' })
		}
	}
	catch (e) {
		console.log(e)
		resp.send({ Response: 'Something Went Wrong' })
	}
})

// logout function
app.post('/logout', async (req, resp) => {
	console.log('logging out')
	try {
		const { email } = req.body;
		const res = await Log.findOneAndDelete({ log_id: email });
		if (res) {
			resp.send({ Response: 'Success' })
		}
		else {
			resp.send({ Response: 'Failed' })
		}
	}
	catch (e) {
		console.log(e)
	}
})


const storage = multer.diskStorage({
	destination: function (req, file, cb) {
		cb(null, "../src/images/profile");
	},
	filename: function (req, file, cb) {
		const uniqueSuffix = guid();
		cb(null, uniqueSuffix + file.originalname)
	}
})
const upload = multer({ storage: storage })
// image upload
app.post('/upload', upload.single('Image'), async (req, resp) => {
	console.log(req.file.filename)
	const imageName = req.file.filename
	const email = req.body.email
	try {
		const existingUser = profile_img.find({ email })
		if (existingUser) {
			const img = await profile_img.findOneAndUpdate({ email: email }, { image: imageName }, { new: true })
			if (img) {
				resp.send({ Response: 'Success' })
			}
			else {
				resp.send({ Response: 'Failed' })
			}
		}
		else {
			const img = await profile_img.create({
				image: imageName,
				email: email
			})
			if (img) {
				resp.send({ Response: 'Success' })
			}
			else {
				resp.send({ Response: 'Failed' })
			}
		}
	}
	catch (e) {
		console.log(e)
	}
})
//fetch profile picture
app.post('/profile', async (req, resp) => {
	const { email } = req.body;
	try {
		const res = profile_img.findOne({ email: email }).then(res => {
			const data = res.toJSON()
			resp.send({Response:'Success',data:data})
		})

	}
	catch (e) {
		console.log(e)
	}
})
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

app.listen(5000);