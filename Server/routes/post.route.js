const postController = require('../controllers/post.controller');
const { auth } = require('../middlewares/auth.user')
const app = require('express').Router()


app.post('/createPost', auth, postController.createPost);
app.get('/get-posts/:id', auth, postController.getAllPost);
app.get('/get-post/:id', auth, postController.getPost);
app.get('/getUserPost/:userId', auth, postController.getUserPost);
app.post('/addComment', auth, postController.addComment);
app.get('/get-comments/:id', auth, postController.getComments);
app.put('/like-comment', auth, postController.likeComment);
app.delete('/delete-comment/:id/:level', auth, postController.deleteComment);
app.put('/:id/like/:type/:user', auth, postController.likePost);
app.delete('/deletePost/:id', auth, postController.deletePost);

module.exports = app