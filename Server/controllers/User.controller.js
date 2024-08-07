require('dotenv').config()
const jwt = require('jsonwebtoken')
const User = require('../models/UserModel');
const Log = require('../models/LoginUserModel');
const OTP = require('../models/otp_model')
const bcrypt = require('bcrypt');
const mongoose = require('mongoose');
const { uploadFileOnCloudinary } = require('../utils/cloudinary.utils')
const { sendEmailOtp, verifyEmailOtp, sendSMSOtp, verfiySMSOtp } = require('../utils/otpUtils');

User.createIndexes();
Log.createIndexes();

exports.sendOtp = async (req, resp) => {
    const { email } = req.body;
    console.log(req.body)
    if (req.body.type == 'email') {
        if (req.body.val && req.body.val === 'login') {
            const user = await User.findOne({ email: email });
            if (user) {
                try {
                    if (await bcrypt.compare(req.body.password, user.password)) {
                        if (await sendEmailOtp(email))
                            resp.status(201).send({ Response: 'Success' })
                    }
                    else {
                        resp.status(500).send({ Response: 'Incorrect' });
                    }
                }
                catch (e) {
                    resp.status(500).send({ Response: 'Failed' })
                }
            }
            else {
                resp.status(500).send({ Response: 'NF' })
            }
        }
        else {
            try {
                console.log(req.body)
                if (await sendEmailOtp(email))
                    resp.status(201).send({ Response: 'Success' })
            }
            catch (e) {
                resp.status(500).send({ Response: 'Failed' })
            }
        }
    }
    else {
        if (req.body.val && req.body.val === 'login') {
            const user = await User.findOne({ email: email });
            if (user) {
                try {
                    if (await bcrypt.compare(req.body.password, user.password)) {
                        if (await sendSMSOtp(email))
                            resp.status(201).send({ Response: 'Success' })
                    }
                    else {
                        resp.status(500).send({ Response: 'Incorrect Password' });
                    }
                }
                catch (e) {
                    resp.status(500).send({ Response: 'Failed' })
                }
            }
            else {
                resp.status(500).send({ Response: 'NF' })
            }
        }
        try {
            if (await sendSMSOtp(email))
                resp.status(201).send({ Response: 'Success' });
        }
        catch (e) {
            resp.status(500).send({ Response: 'Failed' })
        }
    }
}


const createUser = async (req, resp) => {
    try {
        const { email, name, password, username } = req.body;
        let hashedPassword;
        hashedPassword = await bcrypt.hash(password, 10);
        const user = await User.create({ email, name, password: hashedPassword, username, loginStatus: true });
        const login = await Log.create({ log_id: user._id })
        if (user && login) {
            const token = jwt.sign({ user: user._id.toString(), email: email }, process.env.JWT_SECRET_KEY, { expiresIn: process.env.JWT_EXPIRES_IN })
            resp.status(201).send({ Response: "Success", _id: token });
        }
    }
    catch (e) {
        resp.status(500).send({ Response: "internal server error" })
    }
}

exports.userRegister = async (req, resp) => {
    try {
        const { email, otp } = req.body;
        if (req.body.type == 'email') {
            if (await verifyEmailOtp(email, otp)) {
                await createUser(req, resp);
            }
            else {
                resp.status(500).send({ Response: 'Invalid' })
            }
        }
        else {
            if (await verfiySMSOtp(email, otp)) {
                await createUser(req, resp);
            }
        }
    }
    catch (e) {
        console.log(e)
        resp.status(500).send({ Response: 'internal server error' });
    }
}


exports.userLogin = async (req, resp) => {
    try {
        const { log_id, otp } = req.body;
        if (req.body.type == 'email') {
            if (await verifyEmailOtp(log_id, otp)) {
                const result = await User.findOne({ email: log_id });
                const result1 = await User.findOneAndUpdate({ email: log_id }, { loginStatus: true });
                const user = await Log.create({ log_id: result._id });
                if (user) {
                    const token = jwt.sign({ user: result._id.toString(), email: log_id }, process.env.JWT_SECRET_KEY, { expiresIn: process.env.JWT_EXPIRES_IN })
                    resp.status(201).send({ Response: "Success", _id: token });
                }
            }
            else {
                resp.status(400).send({ Response: 'Invalid' })
            }
        }
        else {
            if (await verfiySMSOtp(log_id, otp)) {
                const user = await Log.create({ log_id });
                if (user) {
                    const result = await User.findOne({ email: log_id });
                    const token = jwt.sign({ user: result._id.toString(), email: email }, process.env.JWT_SECRET_KEY, { expiresIn: process.env.JWT_EXPIRES_IN })
                    resp.status(201).send({ Response: "Success", _id: token });
                }
            }
        }
    }
    catch (e) {
        console.log(e)
        resp.status(500).send({ Response: 'Internal server error' });
    }
}

exports.verfiyUserName = async (req, resp) => {
    try {
        const { id } = req.params;
        const existingUser1 = await User.findOne({ username: id });
        if (existingUser1) {
            resp.status(400).send({ Response: 'Failed' })
        }
        else {
            resp.status(201).send({ Response: 'Success' })
        }
    }
    catch (e) {
        resp.status(500).send({ Response: 'Internal server error' })
    }
}

exports.verifyEmail = async (req, resp) => {
    try {
        const { id } = req.params;
        const existingUser2 = await User.findOne({ email: id });
        if (existingUser2) {
            resp.status(400).send({ Response: 'Failed' })
        }
        else {
            resp.status(201).send({ Response: 'Success' })
        }
    }
    catch (e) {
        resp.status(500).send({ Respond: 'wrong' })
    }
}



exports.forgotPasssordOtpVerify = async (req, resp) => {
    const { val, text, otp } = req.body
    try {
        if (val == 'email' || val == 'username') {
            if (await verifyEmailOtp(text, otp))
                resp.status(201).send({ Response: 'Success' });
        }
        else {
            if (val == 'number') {

                if (await verfiySMSOtp(text, otp))
                    resp.status(201).send({ Response: 'Success' })
            }
        }
    }
    catch (e) {
        resp.status(500).send({ Response: 'internal server error' });
    }
}


exports.resetPassword = async (req, resp) => {
    try {
        let hashedPassword
        const { password, text } = req.body;
        hashedPassword = await bcrypt.hash(password, 10);
        response = await User.findOneAndUpdate({ email: text }, { password: hashedPassword }, { new: true })
        if (response) {
            resp.status(201).send({ Response: 'Success' })
        }
    }
    catch (e) {
        resp.status(500).send({ Response: 'internal server error' })
    }
}

exports.userlogout = async (req, resp) => {
    try {
        const { id } = req.params;
        const res = await Log.findOneAndDelete({ log_id: new mongoose.Types.ObjectId(id) });
        const user = await User.findOneAndUpdate({ _id: new mongoose.Types.ObjectId(id) }, { lastLogged: Date.now(), loginStatus: false });
        if (res) {
            resp.status(201).send({ Response: 'Success' })
        }
        else {
            resp.status(400).send({ Response: 'Failed' })
        }
    }
    catch (e) {
        console.log(e)
        resp.status(500).send({ Response: 'internal server error' });
    }
}



exports.imageUpload = async (req, resp) => {
    const email = req.body.email
    try {
        const existingUser = User.find({ email })
        if (existingUser) {
            const res = await uploadFileOnCloudinary(req.files.Image, 'userAvatar')
            const img = await User.findOneAndUpdate({ email: email }, { image: res.secure_url }, { new: true })
            if (img) {
                resp.status(201).send({ Response: 'Success' })
            }
            else {
                resp.status(400).send({ Response: 'Failed' })
            }
        }
    }
    catch (e) {
        console.log(e)
        resp.status(500).send({ Response: 'internal server error' });
    }
}

exports.getProfile = async (req, resp) => {
    const { id } = req.params;
    try {
        const res = await User.findOne({ _id: id })
        if (res) {
            resp.status(201).send({ Response: 'Success', data: res })
        }
    }
    catch (e) {
        console.log(e)
        resp.status(500).send({ Response: 'internal server error' });
    }
}

exports.getUsers = async (req, resp) => {
    try {
        let result = [];
        const object = await User.findOne({ _id: new mongoose.Types.ObjectId(req.params.id) });
        console.log(object);
        const res = await User.find({ $or: [{ username: { $regex: '^' + req.params.target, $options: 'i' } }, { name: { $regex: '^' + req.params.target, $options: 'i' } }] }).exec()
        res.forEach(obj => {
            if (!object.following.includes(obj._id.toString()) && obj._id.toString() !== req.params.id)
                result.push(obj)
        })
        if (result.length > 0) {
            resp.status(201).send({ Response: 'Success', data: result })
        }
        else {
            resp.status(201).send({ Response: 'Success', data: [] })
        }
    }
    catch (e) {
        resp.status(500).send({ Response: 'internal server error' });
    }
}

exports.follow = async (req, resp) => {
    const { id, target } = req.body
    const res = await User.findOneAndUpdate({ _id: new mongoose.Types.ObjectId(id) }, { $push: { following: target } }, { new: true })
    const res2 = await User.findOneAndUpdate({ _id: new mongoose.Types.ObjectId(target) }, { $push: { followers: id } }, { new: true })
    if (res && res2) {
        resp.status(201).send({ Response: 'Success' })
    }
}

exports.unfollow = async (req, resp) => {
    const { id, target } = req.body
    console.log(req.body)
    const res = await User.findOneAndUpdate({ _id: new mongoose.Types.ObjectId(id) }, { $pull: { following: target } }, { new: true })
    const res2 = await User.findOneAndUpdate({ _id: new mongoose.Types.ObjectId(target) }, { $pull: { followers: id } }, { new: true })
    if (res && res2) {
        resp.status(201).send({ Response: 'Success' })
    }

}