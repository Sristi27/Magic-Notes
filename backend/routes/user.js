const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const router = express.Router();
const User = require("../model/user");


router.post("/signup", (req, res, next) => {
    bcrypt.hash(req.body.password, 10).then(
        (hash) => {

            const user = new User({
                email: req.body.email,
                //for secred password,hash it and encrypt it
                password: hash
            });

            user.save().then((result) => {
                res.status(201).json({
                    message: "USer Created",
                    result: result
                }).catch(err => {
                    res.status(404).json({
                        message: "Error",
                        error: err
                    })
                })
            });
        }
    );

})



module.exports = router;