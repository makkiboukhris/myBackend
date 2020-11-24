const express = require("express");
const { register, login, updateFreelancer, uploadProfileIMG } = require("../controllers/user.controller.js");
const { registerRules, validator } = require("../middleware/validator.js");
const isAuth = require('../middleware/passport-setup');
var fs = require('fs'); 
var path = require('path'); 
var multer = require('multer');
const Router = express.Router();

var storage = multer.diskStorage({ 
  destination: (req, file, cb) => { 
      cb(null, 'uploads') 
  }, 
  filename: (req, file, cb) => { 
      cb(null, new Date().toISOString() + file.originalname ) 
  } 
});
var upload = multer({ storage: storage });

Router.post(`/users`,registerRules(),validator,register);

Router.post('/login',login);

Router.post('/update/freelancer/:_id',updateFreelancer);

Router.post("/profileImage/:_id",upload.single('ProfilePhoto'),uploadProfileIMG);

Router.get('/user/current',isAuth(),(req,res)=>{
  res.json(req.user)
})



module.exports = Router;