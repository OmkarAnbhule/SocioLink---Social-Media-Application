const multer = require('multer');
const postController = require('../controllers/post.controller');
const { auth } = require('../middlewares/auth.user')
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

app.post('/createPost', uploadPost.array('files'), auth, postController.createPost);
app.get('/get-posts/:id', auth, postController.getAllPost);
app.get('/get-post/:id', auth, postController.getPost);
app.post('/addComment', auth, postController.addComment);
app.get('/get-comments/:id', auth, postController.getComments);
app.put('/like-comment', auth, postController.likeComment);
app.delete('/delete-comment/:id/:level', auth, postController.deleteComment);
app.put('/:id/like/:type/:user', auth, postController.likePost);
app.delete('/deletePost/:id', auth, postController.deletePost);

module.exports = app