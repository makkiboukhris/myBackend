// const express = require("express");
// const assert = require("assert");
// const cors = require('cors')
// const { MongoClient, ObjectID } = require("mongodb");
// const bodyParser = require("body-parser");
// const multer = require('multer');
// const fs = require("fs")
// // const { promisify } = require("util")
// // const pipeline = promisify(require("stream").pipeline)


// const app = express();
// app.use(bodyParser.json());
// app.use(cors());
// const MongoURL = "mongodb://localhost:27017";
// const dbName = 'skillancer'
// MongoClient.connect(MongoURL, { useNewUrlParser: true }, (err, client) => {
//   assert.equal(err, null, "connection failed");
//   console.log("success of connection between db and server");
//   var db = client.db(dbName);

//   // SET STORAGE
// var storage = multer.diskStorage({
//   destination: function (req, file, cb) {
//     cb(null, `uploads`)
//   },
//   filename: function (req, file, cb) {
//     cb(null, file.fieldname + '-' + Date.now() + '.jpg')
//   }
// })
// var upload = multer({ storage: storage })


//   app.post("/users", (req, res) => {
//     const body = req.body
//     db.collection('users').insertOne(body, (err, data) => {
//       if (err) {
//         res.status(400).send('failed to insert')
//       }
//       else {
//         res.status(201).send(body)
//       }
//     })
//   })

//   app.post("/ubdate/Usertype", (req, res) => {
//     const body = req.body
//     db.collection('users').updateOne({ "_id": ObjectID(body.id) }, { $set: body }, (err, data) => {
//       if (err) {
//         res.status(400).send('failed to insert')
//       }
//       else {
//         res.status(201).send(body)
//       }
//     })
//   })

//   app.post("/ubdate/WorkerData", (req, res) => {
//     const body = req.body
//     console.log('body', body)
//     db.collection('users').updateOne({ "_id": ObjectID(body.id) }, { $set: body }, (err, data) => {
//       if (err) {
//         res.status(400).send('failed to insert')    
//         console.log('Fail')
//       }
//       else {
//         res.status(201).send(body)
//       }
//     })
//   })
  
//   app.post("/ServicePhotos", upload.array('OtherImages',5),(req, res)=>{
//    if (req.files!==undefined) {
//      res.status(201).send(req.body)
//    } else {
//     res.status(201).send(req.body)
//   }
//   });

//   app.post("/ProfileImg", upload.single('ProfilePhoto'),(req, res)=>{
//     if (req.file!==undefined) {
//     var img = fs.readFileSync(req.file.path);
//     var encode_image = img.toString('base64');
//     // Define a JSONobject for the image attributes for saving to database
    
//     var finalImg = {contentType: req.file.mimetype , image: new Buffer(encode_image, 'base64')};
//     db.collection('users').updateOne({ "_id": ObjectID(req.body.id) }, { $set: finalImg }, (err, result) => {
//       if (err) {
//         res.status(400).send('failed to Upload Photos')
//       }
//       else {
//       res.status(201).send(req.body)
//       }
//     })
//   } else {
//     res.status(201).send(req.body)
//   }
//   });

//   app.get("/Allusers", (req, res) => {
//     db.collection('users').find().toArray((err, data) => {
//       if (err) {
//         res.status(404).send('could not fetch data')
//       }
//       else { res.send(data) }
//     })
//   })
// });
// app.listen('4000', () => {
//   console.log("connection a port 4000")
// })
const express = require('express');

const dbConnect = require('./config/dbConnect');
const router = require('./routes/users');
const projectRouter = require('./routes/projects')

const app = express();
app.use(express.json());
// connect to db
dbConnect();
app.use('/', router);
app.use('/project',projectRouter)

const PORT =   4000 ;
// || process.env.PORT 
  
app.listen(4000, (err) =>
  err ? console.error(err) : console.log(`connection on port ${PORT}`)
);