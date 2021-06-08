const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
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
        minlength: 6
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

userSchema.pre('save', function(next){
  if(this.isModified('password')){
    bcrypt.hash(this.password, SALT_I, (err,hash)=>{
        if(err) return next(err);
        this.password = hash;
        next();
    }) 
  }
  else{
      next()
  }
})

userSchema.methods.comparePassword = function(candidatePass, cb){
    bcrypt.compare(candidatePass, this.password, function(err,isMatch){
        if(err) return cb(err);
        cb(null, isMatch);
    });
}

userSchema.methods.generateToken = function(cb){
    var token = jwt.sign({id:this._id}, config.SECRET,{
        expiresIn: config.JWT_EXPIRE_TIME
    })
    this.token = token;
    this.save(function(err,user){
        if(err) return cb(err);
        cb(null,user);
    });
}

userSchema.statics.findByToken = function(token,cb){
    var user =this;
    jwt.verify(token,config.SECRET,function(err,decode){
        user.findOne({_id:decode.id, token:token}, function(err,user){
            if (err) return cb(err);
            cb(null,user)
        })
    })
}

userSchema.methods.deleteToken = function(token,cb){
    var user= this;
    user.updateOne({$unset:{token:1}},function(err,user){
        if(err) return cb(err);
        cb(null,user);
    })
}

const User = mongoose.model('User',userSchema);

module.exports = {User}