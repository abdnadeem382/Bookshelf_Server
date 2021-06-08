const express = require('express');
const router = express.Router();
const {User} = require('../models/user');
const {auth} = require('../middleware/auth')

router.route('/register').post((req,res)=>{
    const user = new User(req.body);
    user.save((err,doc)=>{
        if(err) return res.status(400).send(err);
        res.status(200).json({
            success: true,
            user: doc
        })
    })
})

router.route('/login').post((req,res)=>{
    User.findOne({'email':req.body.email}, (err,user)=>{
        if(!user) return res.json({
            isAuth: false,
            message: "Auth failed! User not found"
        })
        user.comparePassword(req.body.password, (err,isMatch)=>{
            if(!isMatch){
                return res.json({
                    isAuth: false,
                    message:"Unable to sign in"
                })
            }
            user.generateToken((err,user)=>{
                if(err) return res.status(400).send(err);
                res.cookie('auth',user.token).json({
                    isAuth:true,
                    id: user._id,
                    email: user.email,
                    token: user.token
                })
            })
        })   

    })
})

router.route('/logout').get(auth,(req,res)=>{
    req.user.deleteToken(req.token, (err,user)=>{
        if(err) res.status(400).send(err);
        res.sendStatus(200);
    });
})

router.route('/users').get((req,res )=>{
    User.find().select('-password').exec((err,doc)=>{
        if(err) return res.status(400).send(err);
        res.json({
            success: true,
            doc
        })
    })
})

module.exports = router;