const express = require("express");
const router = express.Router();
const mongoose = require('mongoose')
const requireLogin = require("../middleware/requireLogin")
const Post = require('../models/post')


router.get('/allposts', (req, res) => {
    Post.find()
        .populate("postedBy", "_id name")
        .then(posts => {
            res.json({ posts })
        })
        .catch(err => {
            console.log(err)
        })
})

router.post("/createpost", requireLogin,(req, res) => {
    const { title, body, pic } = req.body
    console.log(title,body,pic)
    if (!title || !body || !pic) {
        return res.status(422).json({ error: "Please add all the fields" })
    }
    // console.log(req.user)
    // res.send("Ok....")
    req.user.password = undefined;
    const post = new Post({
        title: title,
        body: body,
        photo:pic,
        postedBy: req.user
    })
    post.save().then(result => {
        res.json({ post: result })
    })
        .catch((err) =>
            console.log(err)
        )
})

router.get('/myposts', requireLogin,(req, res) => {
    Post.find({ postedBy: req.user })
        .populate("postedBy", "_id ")
        .then(mypost => {
            res.json({ mypost: mypost })
        })
        .catch(err => {
            console.log(err);
        })
})


module.exports = router