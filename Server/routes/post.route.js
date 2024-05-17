const multer = require('multer');
const postController = require('../controllers/post.controller');
const app = require('express').Router()
function S4() {
	return (((1 + Math.random()) * 0x10000) | 0).toString(32).substring(1);
}
const guid = () => (S4() + S4() + "-" + S4() + "-4" + S4());
const storagePost = multer.diskStorage({
	destination: function (req, file, cb) {
		cb(null, "../src/images/posts/");
	},
	filename: function (req, file, cb) {
		const uniqueSuffix = guid();
		cb(null, uniqueSuffix + file.originalname)
	}
})

const uploadPost = multer({ storage: storagePost })

app.post('/createPost', uploadPost.array('files'), postController.createPost);
app.get('/get-posts/:id', postController.getAllPost);
app.get('/get-post/:id', postController.getPost);
app.post('/addComment', postController.addComment);
app.get('/get-comments/:id', postController.getComments);
app.put('/like-comment', postController.likeComment);
app.delete('/delete-comment/:id/:level', postController.deleteComment);
app.put('/:id/like/:type/:user', postController.likePost);
app.delete('/deletePost/:id', postController.deletePost);
module.exports = app