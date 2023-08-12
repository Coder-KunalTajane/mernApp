const express = require("express");
const router = express.Router();
const mongoose = require('mongoose')
// const User = mongoose.model("User");
const User = require('../models/user')

const bcrypt = require('bcryptjs')

const jwt = require('jsonwebtoken')
const {JWT_SECRET}= require('../keys')
const requireLogin = require('../middleware/requireLogin')




//Signup Route....
router.post("/signup", (req, res) => {
    const { name, email, password } = req.body

    if (!email || !password || !name) {
        res.status(422).json({ error: "please add all the fields.." })
    }
    User.findOne({ email: email })
        .then((savedUser) => {
            if (savedUser) {
                return res.status(422).json({ error: "User already exists with that email." })
            }
            bcrypt.hash(password, 12)
                .then(hashedpassword => {
                    const user = new User({
                        name,
                        email,
                        password: hashedpassword,
                    })

                    user.save()
                        .then(user => {
                            res.status(200).json({ message: "Saved successfully" })
                        })
                        .catch(err => {
                            console.log(err)
                        })
                })

        })
        .catch(err => {
            console.log(err)
        })

})

// Signin Route...
router.post('/signin', (req, res) => {
    const { email, password } = req.body

    if (!email || !password) {
        res.status(422).json({ error: "please add email or password" })
    }
    User.findOne({ email: email })
        .then(savedUser => {
            if (!savedUser) {
                return res.status(422).json({ error: 'Invalid Email or password' })
            }
            bcrypt.compare(password, savedUser.password)
                .then(doMatch => {
                    if (doMatch) {
                        // res.json({ message: "successfully signed in.." })
                        const token = jwt.sign({_id:savedUser._id},JWT_SECRET)
                        const {_id,name,email}= savedUser
                        res.json({token, user:{_id,name,email}})

                    } else {
                        res.status(422).json({ error: 'Invalid Email or password' })
                    }
                })
                .catch(err => {
                    console.log("Error while comparing passwords", err);
                })
        })
})

module.exports = router