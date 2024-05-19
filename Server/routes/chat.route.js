const ChatController = require('../controllers/chat.controller');
const app = require('express').Router();

app.post('/CreateChat', ChatController.createChat);
app.post('/sendMessage', ChatController.sendMessage);
app.get('/search/:host/:target', ChatController.getUsers);
app.get('/getChats/:sender', ChatController.getChats);
app.get('/getChat/:chatId/:userId',ChatController.getChat);

module.exports = app