const express = require('express');
const Post = require('../model/post');
const checkAuth= require("../middleware/check-auth");
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
                posts: fetchedPosts,
                maxPosts: count

            })
        });
})

//not allowed to post if not signed in

router.post('',checkAuth, multer({ storage: storage }).single('image'), (req, res) => {
    //image prop from the req body
    const url = req.protocol + "://" + req.get("host");
    const post = new Post({
        title: req.body.title,
        content: req.body.content,
        imagePath: url + "/images/" + req.file.filename,
        creator: req.userData.userId

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

router.put('/:id', checkAuth,multer({ storage: storage }).single('image'), (req, res) => {
//only thhe user who has created it can edit it

    let imagePath = req.body.imagePath;
    if (req.file) {
        const url = req.protocol + "://" + req.get("host");
        imagePath = url + "/images/" + req.file.filename

    }
    const post = new Post({
        _id: req.body.id,
        title: req.body.title,
        content: req.body.content,
        imagePath: imagePath,
        creator:req.userData.userId
    });
    console.log(post)
    Post.updateOne({ _id: req.params.id,creator:req.userData.userId}, post).then(
        result => {
            if(result.nModified>0){
                res.status(200).json({
                message: "Updated"
            });}
            
            else{
                res.status(401).json({
                    message: "Not Updated"
                });

            }
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



router.delete('/:id', checkAuth,(req, res) => {
    Post.deleteOne({ _id: req.params.id ,creator:req.userData.userId}).then(
        response => {
           if(response.n>0)
            res.status(200).json({
                message: "Deleted"
            });
            else{
                res.status(401).json({
                    message: "Not Deleted"
                });
            }
        }
    )
        ;

})

module.exports = router;
