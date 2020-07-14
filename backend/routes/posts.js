const express=require('express');
const Post = require('../model/post');
const http = require('http');
const router=express.Router();

router.get("", (req, res) => {
    Post.find().then(
        documents => {
            res.status(200).json({
                message: 'Saved',
                posts: documents
            });
        })
});

router.post('', (req, res) => {
    const post = new Post({
        title: req.body.title,
        content: req.body.content
    });
    post.save().then((result) => {
        res.status(201).json({
            message: "Post Added",
            postId: result._id
        })
    }).catch(
        () => {
            console.log("Connection Failed");
        }
    );
})

router.put('/:id', (req, res) => {
    const post = new Post({
        _id: req.body.id,
        title: req.body.title,
        content: req.body.content
    });
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

module.exports=router;
