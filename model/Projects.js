const mongoose = require("mongoose");

const projectSchema = mongoose.Schema({
  projectDescription: String,
  budgetmax: String,
  budgetmin: String,
  delay: String,
  skill: String,
  projectName:String,
  projectOwner:mongoose.Schema.Types.ObjectId,
  projectType:String,
  freelancerID:mongoose.Schema.Types.ObjectId,
  projectState:String,
  projectFinished: Boolean,
  pack: String,
});

module.exports = Project = mongoose.model("project", projectSchema);
