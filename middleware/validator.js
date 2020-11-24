
const { check, validationResult } = require("express-validator");

exports.registerRules = () =>[
    check("name", "name is required !!!").notEmpty(),
    check("familyName", "FamilyName is required !!!").notEmpty(),
    check("email", "Email is required !!!").notEmpty(),
    check("email", "Email should be a valid email!!!").isEmail(),
    check("password").isLength({ min: 8 }),
  ];

// exports.updateRules = () =>[
//   check('ProfileDomain','ProfileDomain is required').notEmpty,
//   check('UserLocation','UserLocation is required').notEmpty,
//   check('UserType','UserType is required').notEmpty,
//   check('UserDescreption','UserDescreption is required').notEmpty,
//   check('ServiceDescription','ServiceDescription is required').notEmpty,
//   ];

exports.validator = (req, res, next) =>{
  const errors = validationResult(req);
  errors.isEmpty()?next():res.status(400).json({ errors: errors.array() });
  }