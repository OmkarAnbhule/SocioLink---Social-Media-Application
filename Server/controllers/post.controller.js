const Post = require('../models/PostModel');
const User = require('../models/UserModel');
const { uploadFileOnCloudinary } = require('../utils/cloudinary.utils')
const Comment = require('../models/CommentModel');
const { default: mongoose } = require('mongoose');

User.createIndexes();
Post.createIndexes();
Comment.createIndexes();

const generateOrQuery = (id, levels) => {
    const orQuery = [{ _id: new mongoose.Types.ObjectId(id) }];
    for (let i = 0; i < levels; i++) {
        const path = Array(i + 1).fill("Replies").join(".");
        const query = {};
        query[`${path}._id`] = new mongoose.Types.ObjectId(id);
        orQuery.push(query);
    }
    return orQuery;
};

function traverseObjects(arr, data, type, method) {
    if (type === 'reply') {
        if (method === 'delete') {
            arr.forEach(obj => {
                if (obj._id.toString() === data) {
                    const index = arr.indexOf(obj);
                    if (index !== -1) {
                        arr.splice(index, 1);
                    }
                }
                if (obj.Replies && obj.Replies.length > 0) {
                    traverseObjects(obj.Replies, data, type, method);
                }
            });
        }
        else {
            arr.forEach(obj => {
                if (obj._id.toString() === data.objId) {
                    obj.isReply = true;
                    obj.replyCount = obj.replyCount + 1;
                    obj.Replies.push(new Comment({ comment: data.comment, username: data.username, postId: data.postId }));
                }
                if (obj.Replies && obj.Replies.length > 0) {
                    traverseObjects(obj.Replies, data, type, method);
                }
            });
        }
    }
    else {
        if (method === 'add') {
            arr.forEach(obj => {
                if (obj._id.toString() === data.commentId) {
                    obj.likeCount = obj.likeCount + 1;
                    obj.likedUsers.push(data.username);
                }
                if (obj.Replies && obj.Replies.length > 0) {
                    traverseObjects(obj.Replies, data, type, method);
                }
            });
        }
        else {
            arr.forEach(obj => {
                if (obj._id.toString() === data.commentId) {
                    obj.likeCount--;
                    obj.likedUsers = obj.likedUsers.filter(user => user != data.username);
                }
                if (obj.Replies && obj.Replies.length > 0) {
                    traverseObjects(obj.Replies, data, type, method);
                }
            });
        }
    }

    return arr;
}


exports.createPost = async (req, resp) => {
    try {
        let files_arr = []
        const { id, caption, location, tags } = req.body
        const uploadPromises = req.files.file.map(item => uploadFileOnCloudinary(item, 'reviewFiles'));
        const uploadResults = await Promise.all(uploadPromises);
        files_arr = uploadResults.map(upload => upload.secure_url);
        const filters = Object.values(JSON.parse(req.body.filters)).map(obj => obj);
        const existingUser = await User.find({ _id: new mongoose.Types.ObjectId(id) })
        if (existingUser) {
            const post_create = await Post.create({
                id: id,
                location: location,
                caption: caption,
                tags: tags,
                files: files_arr,
                filters: filters,
            })
            if (post_create) {
                resp.status(201).send({ Response: 'Success' })
            }
            else {
                resp.status(400).send({ Response: 'Failed' })
            }
        }

    }
    catch (e) {
        resp.status(500).send({ Response: 'internal server error' });
    }
}

exports.getAllPost = async (req, resp) => {
    try {
        const existing_User = await User.find({ _id: new mongoose.Types.ObjectId(req.params.id) })
        if (existing_User && existing_User[0].following) {
            let arr = existing_User[0].following
            let res = []
            for (let i = 0; i < arr.length; i++) {
                let posts = await Post.find({ id: arr[i] })
                res[i] = posts
            }
            resp.status(201).send({ Response: 'Success', data: res })
        }
        else {
            resp.status(201).send({ Response: 'Success', data: [] })
        }
    }
    catch (e) {
        resp.status(500).send({ Response: 'internal server error' });
    }
}

exports.getPost = async (req, resp) => {
    try {
        console.log(new mongoose.Types.ObjectId(req.params.id))
        const result = await Post.find({ _id: new mongoose.Types.ObjectId(req.params.id) });
        if (result) {
            console.log(result)
            resp.status(201).send({ Response: 'Success', data: result[0] })
        }
    }
    catch (e) {
        console.log(e)
        resp.status(500).send({ Response: 'internal server error' });
    }
}

exports.likePost = async (req, resp) => {
    try {
        if (req.params.type === 'add') {
            const result = await Post.findByIdAndUpdate(req.params.id, { $inc: { likeCount: 1 }, $push: { likedUsers: req.params.user } })
            if (result) {
                resp.status(201).send({ Response: 'Success' })
            }
        }
        else {
            const result = await Post.findByIdAndUpdate(req.params.id, { $inc: { likeCount: -1 }, $pull: { likedUsers: req.params.user } })
            if (result) {
                resp.status(201).send({ Response: 'Success' })
            }
        }
    }
    catch (e) {
        resp.status(500).send({ Response: 'internal server error' });
    }
}

exports.deletePost = async (req, resp) => {
    try {
        const result = await Post.findByIdAndDelete(new mongoose.Types.ObjectId(req.params.id));
        if (result) {
            resp.status(201).send({ Response: 'Success' })
        }
    }
    catch (e) {
        response.status(500).send({ Response: 'internal server' });
    }
}

exports.addComment = async (req, resp) => {
    try {
        const { comment, username, type, postId } = req.body;
        if (type === 'comment') {
            const result = await Comment.create({ comment, username, postId });
            if (result) {
                resp.status(201).send({ Response: 'Success' })
            }
        }
        else {
            const levelsOfNesting = req.body.level;
            const orQuery = generateOrQuery(req.body.objId, levelsOfNesting);
            const obj = await Comment.find({ $or: orQuery })
            const arr = await traverseObjects(obj, req.body, 'reply', null)
            const result = await Comment.findByIdAndUpdate(obj[0]._id, { isReply: arr[0].isReply, replyCount: arr[0].replyCount, Replies: arr[0].Replies });
            if (obj && result) {
                resp.status(201).send({ Response: 'Success' })
            }
        }
    }
    catch (e) {
        console.log(e)
        resp.status(500).send({ Response: 'internal server error' });
    }
}

exports.likeComment = async (req, resp) => {
    try {
        const { commentId, level, username, method } = req.body;
        if (level == 0) {
            const existingComment = await Comment.find({ _id: commentId });
            if (existingComment) {
                if (method == 'add') {
                    const result = await Comment.findByIdAndUpdate(existingComment[0]._id, { likeCount: existingComment[0].likeCount + 1, $push: { likedUsers: username } });
                    if (result) {
                        resp.status(201).send({ Response: 'Success' })
                    }
                }
                else {
                    const result = await Comment.findByIdAndUpdate(existingComment[0]._id, { likeCount: existingComment[0].likeCount - 1, $pull: { likedUsers: username } });
                    if (result) {
                        resp.status(201).send({ Response: 'Success' })
                    }
                }
            }
            else {
                resp.status(400).send({ Response: 'Failed' })
            }
        }
        else {
            const orQuery = generateOrQuery(commentId, level);
            const obj = await Comment.find({ $or: orQuery });
            const arr = traverseObjects(obj, req.body, 'like', method);
            const result = await Comment.findByIdAndUpdate(obj[0]._id, { Replies: arr[0].Replies });
            if (result) {
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

exports.getComments = async (req, resp) => {
    try {
        const comments = await Comment.find({ postId: req.params.id });
        if (comments) {
            resp.status(201).send({ Response: 'Success', data: comments })
        }
        else {
            resp.status(201).send({ Response: 'Success', data: [] })
        }
    }
    catch (e) {
        console.log(e)
        resp.status(500).send({ Response: 'internal server error' });
    }
}

exports.deleteComment = async (req, resp) => {
    try {
        if (req.params.level == 0) {
            const result = await Comment.findByIdAndDelete(new mongoose.Types.ObjectId(req.params.id));
            if (result) {
                resp.status(201).send({ Response: 'Success' });
            }
        }
        else {
            const orQuery = generateOrQuery(req.params.id, req.params.level);
            const obj = await Comment.find({ $or: orQuery });
            const arr = traverseObjects(obj, req.params.id, 'reply', 'delete');
            const result = await Comment.findByIdAndUpdate(obj[0]._id, { Replies: arr[0].Replies });
            if (result) {
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
