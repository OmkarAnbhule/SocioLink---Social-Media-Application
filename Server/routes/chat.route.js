const ChatController = require('../controllers/chat.controller');
const { auth } = require('../middlewares/auth.user')
const app = require('express').Router();

app.post('/CreateChat', auth, ChatController.createChat);
app.post('/sendMessage', auth, ChatController.sendMessage);
app.get('/search/:id/:target', auth, ChatController.getUsers);
app.get('/getChats/:id', auth, ChatController.getChats);
app.get('/getChat/:chatId/:id', auth, ChatController.getChat);

module.exports = app