const express = require('express');
const Post = require('../model/post');
const http = require('http');
const multer = require('multer');

const router = express.Router();

const MIME_TYPE = {
    'image/png': 'png',
    'image/jpeg': 'jpeg',
    'image/jpg': 'jpg',
}

const storage = multer.diskStorage({
    destination: (req, file, cb) => {

        const isValid = MIME_TYPE[file.mimetype];
        let error = new Error("Invalid");
        if (isValid) {
            error = null;
        }
        cb(error, "backend/images");//relative to server.js
    },
    filename: (req, file, cb) => {
        const name = file.originalname.toLowerCase().split(' ').join('-');
        const ext = MIME_TYPE[file.mimetype];
        cb(null, name + '-' + Date.now() + '.' + ext);
    }
})


router.get("", (req, res) => {

    const pageSize = +req.query.pagesize;
    const currentPage = +req.query.page;
    const postQuery = Post.find();
    let fetchedPosts;
    if (pageSize && currentPage) {
        postQuery.skip(pageSize * (currentPage - 1)) //skipping pages
            .limit(pageSize);   //limiting
    }
    postQuery.then(
        documents => {
            fetchedPosts = documents;
            return Post.count();

        }).then(count => {
            res.status(200).json({
                message: 'Saved',
                posts: fetchedPosts

            })
        });
})


router.post('', multer({ storage: storage }).single('image'), (req, res) => {
    //image prop from the req body
    const url = req.protocol + "://" + req.get("host");
    const post = new Post({
        title: req.body.title,
        content: req.body.content,
        imagePath: url + "/images/" + req.file.filename

    });
    post.save().then((result) => {
        res.status(201).json({
            message: "Post Added",
            post: {
                ...result,
                id: result._id

            }
        })
    }).catch(
        () => {
            console.log("Connection Failed");
        }
    );
})

router.put('/:id', multer({ storage: storage }).single('image'), (req, res) => {

    let imagePath = req.body.imagePath;
    if (req.file) {
        const url = req.protocol + "://" + req.get("host");
        imagePath = url + "/images/" + req.file.filename

    }
    const post = new Post({
        _id: req.body.id,
        title: req.body.title,
        content: req.body.content,
        imagePath: imagePath
    });
    console.log(post)
    Post.updateOne({ _id: req.params.id }, post).then(
        result => {
            console.log(result);
            res.status(200).json({
                message: "Updated"
            })
        }
    )

})


router.get('/:id', (req, res) => {

    Post.findById(req.params.id).then(post => {
        if (post) {
            res.status(200).json(post);
        }
        else {
            res.status(400).send("error")
        }
    })

})



router.delete('/:id', (req, res) => {
    Post.deleteOne({ _id: req.params.id }).then(
        response => {
            console.log(response);
            res.status(200).json({
                message: "Deleted"
            });
        }
    )
        ;

})

module.exports = router;
