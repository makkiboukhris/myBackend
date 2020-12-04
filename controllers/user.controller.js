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
    });
    await User.findByIdAndUpdate(
      { _id: projectOwner },
      {
        $push: {
          actualProjects: {
            projectName,
            projectDescription,
            projectOwner,
            projectType: "PUBLIC",
          },
        },
      },
      { new: true }
    );
    newProject.save();
    res.status(200).json(newProject);
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
      waitingProjects: user.waitingProjects,
      actualProjects: user.actualProjects,
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
    // console.log('selectedProfile', selectedProfile)
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
  console.log("req.body", req.body);
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
    });
    const addedProject = await newProject.save();
    await User.findByIdAndUpdate(
      { _id: freelancer },
      {
        $push: {
          waitingProjects: {
            _id:addedProject._id
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
            _id:addedProject._id
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

exports.getWaitingProjects = async (req,res) =>{
  const projectIDs = req.body
  try {
    const projects = await Project.find({
      '_id': { $in: projectIDs }
  });
    console.log('projects', projects.length)
    return res.status(200).json(projects);
  } catch (error) {
    console.error(error);
    res.status(500).json({ errors: error })
  }
}

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
  const { accept, projectID } = req.body;
  let x = '';
  if (accept) {
    x = "le freelancer a accepté de travailler sur ce projet";
  } else {
    x = "Désolé, le freelancer n'a accepté de travailler sur ce projet";
  }
  console.log("x", x);
  try {
    const project = await Project.findByIdAndUpdate({ _id: projectID },
      {
       projectState: x
      },
      { new: true });

    res.status(201).json(project);
  } catch (error) {
    console.error(error);
    res.status(500).json(error);
  }
};
