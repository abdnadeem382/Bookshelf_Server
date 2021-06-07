const mongoose = require("mongoose");
const bcrypt = require("bcrpyt");
const jwt = require("jsonwebtoken");
const validator = require('validator');
const config = require('../config/config').get(process.env.NODE_ENV);
const SALT_I = 10;

const userSchema = mongoose.Schema({
    email: {
        type: String,
        required: true,
        trim: true,
        unique: 1,
        validate: [validator.isEmail, 'Please enter a valid email address']
    },
    password:{
        type: String,
        required: true,
        minlength: 6,
        select: false
    },
    name:{
        type: String,
        maxlength: 30
    },
    lastname:{
        type: String,
        maxlength: 30
    },
    role:{
        type: Number,
        default: 0
    },
    token:{
        type: String
    }
})

const User = mongoose.model('User',userSchema);

module.exports = {User}