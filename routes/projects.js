const express = require("express");
const Router = express.Router();
const {uploadPublicProject, uploadPrivateProject, getWaitingProjects} = require("../controllers/user.controller.js");

Router.post('/public/upload',uploadPublicProject)

Router.post('/private/upload',uploadPrivateProject)

Router.post('/getWaiting', getWaitingProjects)

module.exports = Router;