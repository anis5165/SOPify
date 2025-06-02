const express =require ('express');
const router = express.Router();
const Model = require('../models/userModel');
const jwt=require('jsonwebtoken');
require('dotenv').config();

router.post('/add',(req,res) =>{
    console.log(req.body);
    
    new Model(req.body).save()
    .then((result) => {
       res.status(200).json(result); 
    }).catch ((err) => {
       console.log(err);
       res.status(500).json(err); 
    });
});

router.get('/getall',(req,res)=>{
    Model.find()
    .then((result) => {
        res.status(200).json(result);
    }).catch((err) => {
        console.log(err);
        res.status(500).json(err);
    });
})


// : denotes url parameter
router.get('/getbyemail/:email',(req,res) => {
    console.log(req.params.email)
    res.send('response from user getbyemail');
    });

//getall
router.get('/getall',(req,res)=>{
    res.send('response from user getall');
});
//getbyid
router.get('/getbyid/:id',(req,res)=>{
    console.log(req.params.id);
    res.send('response from user getbyid with id ${req,params.id}');
});
//update
router.put('/update/:id',(req,res)=>{
    console.log("ID:",req.params.id);
    console.log("Updated Data:",req.body);
    res.send('response from user update with id ${req,params.id}');
});
//delete
router.delete('/delete/:id',(req,res)=>{
   Model.findByIdAndDelete(req.params.id)
    .then((result) => {
        res.status(200).json(result);
    }).catch((err) => {
      console.log(err);
      res.status(500).json(err)
    });
});
router.post('/authenticate',(req,res)=>{
    Model.findOne(req.body)
    .then((result) => {
        if(result){
            //login success-generate token
            const{_id,name,email}=result;
            const payload={_id,name,email};


            jwt.sign(
                payload,
                process.env.JWT_SECRET,
                {expiresIn:'6h'},
                (err,token) => {
                    if(err){
                        console.log(err);
                        res.status(500).json({err});
                    }else{
                        res.status(200).json({token});
                    }

                }
            )
        }else{
            //login failed-send error message
            res.status(401).json({message:'Invalid username or password'});
        }
    }).catch((err) => {
        console.log(err);
        res.status(500).json(err);
    });
});
module.exports = router;