const express = require('express');
const router = express.Router();
const {Book}  = require('../models/book')



router.route('/getbook').get((req,res)=>{
    let id = req.query.id;
    const book = Book.findById(id,(err,doc)=>{
        if(err) return res.status(400).send(err);
        res.send(doc);
    })
})

router.route('/getbooks').get((req,res)=>{
    let skip= parseInt(req.query.skip);
    let limit = parseInt(req.query.limit);
    let order = req.query.order;

    Book.find().skip(skip).sort({_id: order}).limit(limit).exec((err,doc)=>{
        if(err) return res.status(400).send(err);
        res.send(doc);  
    })
})

router.route('/book').post((req,res)=>{
    const book = new Book(req.body);
    book.save((err,doc)=>{
        if(err) return res.status(400).send(err);
        res.status(200).json({
            success: true,
            post: true,
            bookId: doc._id
        })
    });
})

router.route('/update').put((req,res)=>{
    Book.findByIdAndUpdate(req.body._id,req.body, {new:true}, (err,doc)=>{
        if (err) return res.status(400).send(err);
        res.json({
            success: true, 
            doc
        })
    })
})

router.route('/delete').delete((req,res)=>{
    Book.findOneAndDelete(req.query.id,(err,doc)=>{
        if (err) return res.status(400).send(err);
        res.json({
            success: true,
            doc
        })
    })
})

module.exports = router;