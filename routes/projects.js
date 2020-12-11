const express = require("express");
const Router = express.Router();
const {uploadPublicProject, uploadPrivateProject, getWaitingProjects, deleteProject, updateFinishedProject, updateRecievedProject, getPublicProjects, workOnPublicProject, hireThisFreelancer} = require("../controllers/user.controller.js");

Router.post('/public/upload',uploadPublicProject)

Router.post('/private/upload',uploadPrivateProject)

Router.post('/getWaiting', getWaitingProjects)

Router.post('/isFinished', updateFinishedProject)

Router.post('/isRecieved', updateRecievedProject)

Router.post('/deletePrivate',deleteProject)

Router.post('/hireThisFreelancer', hireThisFreelancer)

Router.post('/workOnPublicProject', workOnPublicProject)

Router.get('/getPublicProjects', getPublicProjects)

module.exports = Router;