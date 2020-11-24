const mongoose = require("mongoose");

const contactSchema = mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,

  name: {
    type: String,
    required: true,
  },

  familyName: {
    type: String,
    required: true,
  },

  email: String,

  password: {
    type: String,
    required: true,
  },

  userType: String,

  ProfileDomain: String,

  ProfileBIO: String,

  UserLocation: String,

  UserType: String,

  UserGender: String,

  CompanyName: String,

  UserDescreption:String,

  ServiceDescription: String,

  Standard: Boolean,

  Premium: Boolean,

  BasicPrice: String,

  StandardPrice: String,

  PremiumPrice: String,

  BasicDeliveryTime: String,

  StandardDeliveryTime: String,

  PremiumDeliveryTime: String,

  TableRowValues: [{}],

  ProfileImage:{
    data: Buffer,
    type: String,
  }
});

module.exports = User = mongoose.model("user", contactSchema);
