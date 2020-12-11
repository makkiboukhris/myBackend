const express = require("express");
const { register, login, updateFreelancer, getList, getSelectedProfile, comment, rating, responseToPrivateProject, getEmail, getFreelancersWorkinOnPublicProject } = require("../controllers/user.controller.js");
const { registerRules, validator } = require("../middleware/validator.js");
const isAuth = require('../middleware/passport-setup');
var multer = require('multer');
const Router = express.Router();



var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './uploads')
  },
  filename: function (req, file, cb) {
    cb(null, file.fieldname + '-' + Date.now() + file.originalname)
  }
})
 
var upload = multer({ storage: storage })


Router.post(`/users`,registerRules(),validator,register);
 
Router.post('/login',login);

Router.post('/update/freelancer/:_id',updateFreelancer);

Router.post('/rating',rating)

Router.post('/shareComment',comment)

Router.post('/getFreelancersWorkinOnPublicProject', getFreelancersWorkinOnPublicProject)

Router.post("/profileImage/:_id",upload.single('ProfilePhoto'), (req,res) =>{
  res.json(req.file)
});

Router.post("/otherImages/:_id",upload.array('OtherImages',5), (req,res) =>{
  res.json(req.files)
});

Router.get('/user/current',isAuth(),(req,res)=>{
  res.json(req.user)
})

Router.get('/getAllFreelancers', getList)

Router.get('/getselectedFreelancer', getSelectedProfile)

Router.post('/responseToPrivateProject', responseToPrivateProject)

Router.get('/getEmail',getEmail)


module.exports = Router;