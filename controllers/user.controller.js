const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const config = require("config");
const User = require("../model/Users");
const mongoose = require("mongoose");
const Project = require("../model/Projects");
const secretOrKey = config.get("secretOrKey");

exports.register = async (req, res) => {
  // console.log("req", req.body);
  const { name, familyName, email, password, userType } = req.body;
  try {
    const searchResult = await User.findOne({ email });
    // console.log("searchResult", searchResult);
    if (searchResult)
      return res.status(400).json({ msg: `user already exist!` });
    const _id = new mongoose.Types.ObjectId();
    const newUser = new User({
      _id,
      name,
      familyName,
      email,
      password,
      userType,
    });
    const payload = {
      _id: _id,
      name: name,
      familyName: familyName,
      email: email,
      userType: userType,
    };
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(password, salt);
    newUser.password = hash;
    newUser.save();
    // res.status(201).json(newUser);
    const token = await jwt.sign(payload, secretOrKey);
    return res
      .status(200)
      .json({ token: `Bearer ${token}`, userType: newUser.userType });
  } catch (error) {
    console.error(error);
    res.status(500).json({ errors: error });
  }
};

exports.uploadPublicProject = async (req, res) => {
  const {
    projectName,
    projectOwner,
    projectDescription,
    budgetmin,
    budgetmax,
    delay,
    skill,
  } = req.body;
  const searchResult = await Project.findOne({ projectName });
  console.log("searchResult", searchResult);
  if (searchResult)
    return res.status(400).json({ msg: `project already exist!` });
  try {
    const newProject = new Project({
      projectName,
      projectOwner,
      projectDescription,
      budgetmin,
      budgetmax,
      delay,
      skill,
      projectType: "PUBLIC",
      projectFinished: false,
      projectState: "En attente",
      projectReceived: false,
    });
    const addedProject = await newProject.save();
    await User.findByIdAndUpdate(
      { _id: projectOwner },
      {
        $push: {
          waitingProjects: {
            _id: addedProject._id,
          },
        },
      },
      { new: true }
    );
    res.status(200).json(addedProject);
  } catch (error) {
    console.error(error);
    res.status(500).json({ errors: error });
  }
};

exports.login = async (req, res) => {
  const { email, password } = req.body;
  console.log("req.body", req.body);
  try {
    const user = await User.findOne({ email });
    console.log("user", user);
    if (!user) return res.status(404).json({ msg: `bad credentials!` });
    const isMatch = await bcrypt.compare(password, user.password);
    console.log("isMatch", isMatch);
    if (!isMatch) return res.status(401).json({ msg: `bad credentials!!` });
    const payload = {
      _id: user._id,
      name: user.name,
      familyName: user.familyName,
      email: user.email,
      userType: user.userType,
    };

    const token = await jwt.sign(payload, secretOrKey);
    return res.status(200).json({ token: `Bearer ${token}` });
  } catch (error) {
    console.error(error);
    res.status(500).json({ errors: error });
  }
};

exports.getList = async (req, res) => {
  const ProfileDomain = req.headers.domain;
  try {
    const list = await User.find({ ProfileDomain });
    return res.status(200).json({ list });
  } catch (error) {
    console.error(error);
    res.status(500).json({ errors: error });
  }
};

exports.getSelectedProfile = async (req, res) => {
  const _id = req.headers._id;
  try {
    const selectedProfile = await User.findById({ _id });
    return res.status(200).json({ selectedProfile });
  } catch (error) {
    console.error(error);
    res.status(500).json({ errors: error });
  }
};

exports.updateFreelancer = async (req, res) => {
  console.log("im in backend upload func");
  // console.log("req.body", req.body);
  const { _id } = req.params;
  const {
    ProfileDomain,
    Standard,
    Premium,
    BasicPrice,
    StandardPrice,
    PremiumPrice,
    BasicDeliveryTime,
    StandardDeliveryTime,
    PremiumDeliveryTime,
    TableRowValues,
    ProfileBIO,
    UserLocation,
    UserType,
    UserGender,
    CompanyName,
    UserDescreption,
    ServiceDescription,
  } = req.body;

  try {
    const newData = {
      ProfileDomain,
      Standard,
      Premium,
      BasicPrice,
      StandardPrice,
      PremiumPrice,
      BasicDeliveryTime,
      StandardDeliveryTime,
      PremiumDeliveryTime,
      TableRowValues,
      ProfileBIO,
      UserLocation,
      UserType,
      UserGender,
      CompanyName,
      UserDescreption,
      ServiceDescription,
    };

    const updateRes = await User.findByIdAndUpdate(_id, newData);

    const user = await User.findOne({ _id }).select("-password");

    const payload = {
      _id: user._id,
      updated: user.updated,
      name: user.name,
      familyName: user.familyName,
      email: user.email,
      ProfileDomain: user.ProfileDomain,
      Standard: user.Standard,
      Premium: user.Premium,
      BasicPrice: user.BasicPrice,
      StandardPrice: user.StandardPrice,
      PremiumPrice: user.PremiumPrice,
      BasicDeliveryTime: user.BasicDeliveryTime,
      StandardDeliveryTime: user.StandardDeliveryTime,
      PremiumDeliveryTime: user.PremiumDeliveryTime,
      TableRowValues: user.TableRowValues,
      ProfileBIO: user.ProfileBIO,
      UserLocation: user.UserLocation,
      UserType: user.UserType,
      UserGender: user.UserGender,
      CompanyName: user.CompanyName,
      UserDescreption: user.UserDescreption,
      ServiceDescription: user.ServiceDescription,
      userType: user.userType,
    };

    const token = await jwt.sign(payload, secretOrKey);

    return res.status(200).json({ token: `Bearer ${token}`, updateRes });
  } catch (error) {
    console.error(error);
    res.status(500).json(error);
  }
};

exports.uploadPrivateProject = async (req, res) => {
  const {
    projectDescription,
    projectName,
    freelancer,
    projectOwner,
    pack,
  } = req.body;
  try {
    const newProject = new Project({
      projectName: projectName,
      projectOwner: projectOwner,
      projectDescription: projectDescription,
      freelancerID: freelancer,
      pack: pack,
      projectType: "PRIVATE",
      projectState: "En attente",
      projectFinished: false,
      projectReceived: false,
    });
    const addedProject = await newProject.save();
    await User.findByIdAndUpdate(
      { _id: freelancer },
      {
        $push: {
          waitingProjects: {
            _id: addedProject._id,
          },
        },
      },
      { new: true }
    );
    await User.findByIdAndUpdate(
      { _id: projectOwner },
      {
        $push: {
          waitingProjects: {
            _id: addedProject._id,
          },
        },
      },
      { new: true }
    );
    res.status(200).json(newProject);
  } catch (error) {
    console.error(error);
    res.status(500).json({ errors: error });
  }
};

exports.getWaitingProjects = async (req, res) => {
  const { waitingProjectsIDs, actualProjectsIDs } = req.body;
  try {
    const waitingProjects = await Project.find({
      _id: { $in: waitingProjectsIDs },
    });
    const actualProjects = await Project.find({
      _id: { $in: actualProjectsIDs },
    });
    return res.status(200).json({ waitingProjects, actualProjects });
  } catch (error) {
    console.error(error);
    res.status(500).json({ errors: error });
  }
};

exports.comment = async (req, res) => {
  const { sender, comments, date, freelancerID } = req.body;
  try {
    const newComment = await User.findByIdAndUpdate(
      { _id: freelancerID },
      {
        $push: {
          comments: {
            sender,
            comments,
            date,
          },
        },
      },
      { new: true }
    );
    res.status(201).json(newComment);
  } catch (error) {
    console.error(error);
    res.status(500).json(error);
  }
};

exports.rating = async (req, res) => {
  const { sender, rateValue, freelancerID } = req.body;
  try {
    const newRating = await User.findByIdAndUpdate(
      { _id: freelancerID },
      {
        $push: {
          ratings: {
            sender,
            rateValue,
          },
        },
      },
      { new: true }
    );
    res.status(201).json(newRating);
  } catch (error) {
    console.error(error);
    res.status(500).json(error);
  }
};

exports.responseToPrivateProject = async (req, res) => {
  const { accept, projectID, projectOwner, freelancer } = req.body;
  let x = "";
  if (accept) {
    x = "Le freelancer a accepté de travailler sur ce projet";
  } else {
    x = "Désolé, le freelancer n'a pas accepté de travailler sur ce projet";
  }
  try {
    const project = await Project.findByIdAndUpdate(
      { _id: projectID },
      {
        projectState: x,
      },
      { new: true }
    );
    if (accept) {
      await User.findByIdAndUpdate(
        { _id: freelancer },
        {
          $push: {
            actualProjects: {
              _id: projectID,
            },
          },
        },
        { new: true }
      );
    }
    const updatedFreelancer = await User.findByIdAndUpdate(
      { _id: freelancer },
      {
        $pull: { waitingProjects: projectID },
      },
      { new: true }
    );
    res.status(201).json({ project, updatedFreelancer });
  } catch (error) {
    console.error(error);
    res.status(500).json(error);
  }
};

exports.deleteProject = async (req, res) => {
  const { projectID, projectOwnerID, freelancerID } = req.body;
  try {
    const deletedProject = await Project.findByIdAndDelete(projectID);
    const updatedOwner = await User.findByIdAndUpdate(
      { _id: projectOwnerID },
      {
        $pull: { waitingProjects: projectID },
      },
      { new: true }
    );
    await User.updateMany(
      {_id:{ $in: freelancerID } },
      {
        $pull: { waitingProjects: projectID },
      }
    );
    console.log(
      "🚀 ~ file: user.controller.js ~ line 402 ~ exports.deleteProject ~ updatedOwner",
      updatedOwner
    );
    res.status(201).json({ updatedOwner, deletedProject });
  } catch (error) {
    console.error(error);
    res.status(500).json(error);
  }
};

exports.getEmail = async (req, res) => {
  const { _id } = req.headers;
  try {
    const client = await User.findById(_id);
    res.status(201).json(client.email);
  } catch (error) {
    console.error(error);
    res.status(500).json(error);
  }
};

exports.updateFinishedProject = async (req, res) => {
  const { projectID } = req.body;
  try {
    const projectFinished = await Project.findByIdAndUpdate(
      { _id: projectID },
      {
        projectFinished: true,
      },
      { new: true }
    );
    await Project.findByIdAndUpdate(
      { _id: projectID },
      {
        projectState: "Le projet est terminé",
      },
      { new: true }
    );
    await Project.findByIdAndUpdate(
      { _id: projectID },
      {
        projectNotReceived: "",
      },
      { new: true }
    );
    console.log(
      "🚀 ~ file: user.controller.js ~ line 429 ~ exports.updateFinishedProject= ~ projectFinished",
      projectFinished
    );
    res.status(201).json(projectFinished);
  } catch (error) {
    console.error(error);
    res.status(500).json(error);
  }
};

exports.updateRecievedProject = async (req, res) => {
  const { recieved, projectID, freelancerID, projectOwnerID } = req.body;
  try {
    const projectRecieved = await Project.findByIdAndUpdate(
      { _id: projectID },
      {
        projectReceived: recieved,
      },
      { new: true }
    );
    if (!recieved) {
      await Project.findByIdAndUpdate(
        { _id: projectID },
        {
          projectNotReceived:
            "Le recrutteur n'a pas reçu le projet veillez reéssayer",
        },
        { new: true }
      );
    }
    if (recieved) {
      await Project.findByIdAndDelete(projectID);
      await User.findByIdAndUpdate(
        { _id: projectOwnerID },
        {
          $pull: { waitingProjects: projectID },
        },
        { new: true }
      );
      await User.findByIdAndUpdate(
        { _id: freelancerID },
        {
          $pull: { actualProjects: projectID },
        },
        { new: true }
      );
    }
    res.status(201).json(projectRecieved);
  } catch (error) {
    console.error(error);
    res.status(500).json(error);
  }
};

exports.getPublicProjects = async (req, res) => {
  const { skill } = req.headers;
  try {
    const list = await Project.find({ skill });
    return res.status(200).json({ list });
  } catch (error) {
    console.error(error);
    res.status(500).json(error);
  }
};

exports.workOnPublicProject = async (req, res) => {
  const { projectID, freelancerID } = req.body;
  try {
    const freelancer = await Project.findByIdAndUpdate(
      { _id: projectID },
      {
        $push: {
          freelancers: {
            _id: freelancerID,
          },
        },
      },
      { new: true }
    );
    await User.findByIdAndUpdate(
      { _id: freelancerID },
      {
        $push: {
          waitingProjects: {
            _id: projectID,
          },
        },
      },
      { new: true }
    );
    return res.status(200).json(freelancer);
  } catch (error) {
    console.error(error);
    res.status(500).json(error);
  }
};

exports.getFreelancersWorkinOnPublicProject = async (req, res) => {
  const { freelancerIDs } = req.body;
  console.log(
    "🚀 ~ file: user.controller.js ~ line 558 ~ exports.getFreelancersWorkinOnPublicProject= ~ freelancerIDs",
    freelancerIDs
  );
  try {
    const freelancers = await User.find({
      _id: { $in: freelancerIDs },
    });
    return res.status(200).json(freelancers);
  } catch (error) {
    console.error(error);
    res.status(500).json(error);
  }
};

exports.hireThisFreelancer = async (req, res) => {
  const { freelancerID, projectID, freelancerArray } = req.body;
  try {
    const hiredFreelancer = await User.findByIdAndUpdate(
      { _id: freelancerID },
      {
        $push: {
          actualProjects: {
            _id: projectID,
          },
        },
      },
      { new: true }
    );
    await Project.findByIdAndUpdate(
      { _id: projectID },
      {
        isTaken: freelancerID,
      },
      { new: true }
    );
    await Project.findOneAndUpdate(
      { _id: projectID },
      {
        freelancers: [],
      },
      { new: true }
    );
    await User.updateMany(
      {_id:{ $in: freelancerArray} },
      {
        $pull: { waitingProjects: projectID },
      }
    )
    return res.status(200).json(hiredFreelancer);
  } catch (error) {
    console.error(error);
    res.status(500).json(error);
  }
};
