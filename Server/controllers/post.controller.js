const Post = require('../models/PostModel');
const User = require('../models/UserModel');

User.createIndexes();
Post.createIndexes();

exports.createPost = async (req, resp) => {
    try {
        const { id, caption, location, tags } = req.body
        const files = req.files.map((item, index) => ({
            filename: item.filename,
            filetype: item.filetype,
            mimetype: item.mimetype,
            size: item.size,
        }))
        const filters = JSON.parse(req.body.filters)
        const existingUser = await User.find({ email: id })
        if (existingUser) {
            const post_create = await Post.create({
                id: id,
                location: location,
                caption: caption,
                tags: tags,
                files: files,
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
        console.log('get-post')
        const existing_User = await User.find({ email: req.body.id })
        if (existing_User) {
            let arr = existing_User[0].following
            let res = []
            console.log(arr)
            for (let i = 0; i < arr.length; i++) {
                let posts = await Post.find({ id: arr[i] })
                console.log(posts)
                res[i] = posts
            }
            console.log(res)
            resp.status(201).send({ Response: 'Success', data: res })
        }
    }
    catch (e) {
        resp.status(500).send({ Response: 'internal server error' });
    }
}



exports.follow = async (req, resp) => {
    const { host, target } = req.body
    const res = await User.findOneAndUpdate({ email: host }, { $push: { following: target } }, { new: true })
    const res2 = await User.findOneAndUpdate({ email: target }, { $push: { followers: host } }, { new: true })
    if (res) {
        resp.status(201).send({ Response: 'Success' })
    }
}