const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const config = require("config");
const User = require("../model/Users");
const mongoose = require("mongoose");
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
      userType:user.userType
    };

    const token = await jwt.sign(payload, secretOrKey);
    return res.status(200).json({ token: `Bearer ${token}` });
  } catch (error) {
    console.error(error);
    res.status(500).json({ errors: error });
  }
};



exports.uploadProfileIMG = async (req,res) =>{
  console.log('req.files', req.files)
}




















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

    const user = await User.findOne({ _id }).select('-password')

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
    }

    const token = await jwt.sign(payload, secretOrKey);

    return res.status(200).json({ token: `Bearer ${token}`, updateRes });

  } catch (error) {
    console.error(error);
    res.status(500).json(error);
  }
};
