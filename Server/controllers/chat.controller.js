const { response } = require('express');
const Chat = require('../models/ChatBoxModel');
const Message = require('../models/MessageModel');
const User = require('../models/UserModel');
const mongoose = require('mongoose');


exports.createChat = async (req, res) => {
    try {
        const { sender, receiver } = req.body;
        const existingChat = await Chat.find({ $or: [{ User1: new mongoose.Types.ObjectId(sender), User2: new mongoose.Types.ObjectId(receiver) }, { User1: new mongoose.Types.ObjectId(receiver), User2: new mongoose.Types.ObjectId(sender) }] });
        if (existingChat.length <= 0) {
            const result = await Chat.create({ User1: new mongoose.Types.ObjectId(sender), User2: new mongoose.Types.ObjectId(receiver) });
            if (result) {
                res.status(201).send({ Response: 'Success', id: result._id.toString() });
            }
        }
        else {
            res.status(201).send({ Response: 'Success', id: existingChat[0]._id.toString() });
        }
    }
    catch (e) {
        console.log(e)
        res.status(500).send({ Response: 'internal server error' });
    }
}

exports.sendMessage = async (req, res) => {
    try {
        const { message, chatId, sender, receiver } = req.body;
        const result = await Message.create({ message, sender, receiver });
        const chat = await Chat.findById(chatId);
        const userId = chat.User1.toString();
        const isSenderUser1 = userId === sender;
        const isReceiverUser1 = userId === receiver;
        const chatUpdateResult = await Chat.findByIdAndUpdate(
            chatId,
            {
                isSenderRead: isSenderUser1,
                isReceiverRead: isReceiverUser1,
                recent: message,
                $push: { message: result._id }
            },
            { new: true, useFindAndModify: false }
        );
        if (result && chatUpdateResult) {
            res.status(201).send({ Response: 'Success' });
        } else {
            res.status(400).send({ Response: 'Failed' });
        }
    } catch (e) {
        console.log(e);
        res.status(500).send({ Response: 'Internal server error' });
    }
};




exports.getChat = async (req, res) => {
    try {
        const { chatId, userId } = req.params;
        const result = await Chat.findById(chatId);
        const user = result.User1.toString();
        const isSenderUser1 = user === userId;
        await Chat.findByIdAndUpdate(new mongoose.Types.ObjectId(chatId),
            {
                isSenderRead: isSenderUser1,
                isReceiverRead: !isSenderUser1,
            }
        );
        const chat = await Chat.find({ _id: new mongoose.Types.ObjectId(chatId) }).populate("message");
        if (chat) {
            res.status(200).send({ Response: 'Success', data: chat });
        }
    }
    catch (e) {
        console.log(e)
        res.status(500).send({ Response: 'internal server error' });
    }
}

exports.getChats = async (req, res) => {
    try {
        const { sender } = req.params;
        const existingChat = await Chat.find({ $or: [{ User1: new mongoose.Types.ObjectId(sender) }, { User2: new mongoose.Types.ObjectId(sender) }] });
        if (existingChat) {
            res.status(200).send({ Response: 'Success', data: existingChat });
        }
    }
    catch (e) {
        console.log(e)
        res.status(500).send({ Response: 'internal server error' });
    }
}



exports.getUsers = async (req, res) => {
    try {
        const { host, target } = req.params;
        const hostUser = await User.findOne({ _id: new mongoose.Types.ObjectId(host) });

        if (!hostUser) {
            return res.status(404).json({ message: 'Host user not found' });
        }

        const regex = new RegExp(`^${target}`, 'i');

        const matchingFollowers = await User.find({
            _id: {
                $in: hostUser.following
            },
            $or: [
                { name: { $regex: regex } },
                { username: { $regex: regex } }
            ]
        });
        res.status(200).send({ Response: 'Success', data: matchingFollowers })
    }
    catch (e) {
        console.log(e)
        res.status(500).send({ Response: 'internal server error' });
    }
}
