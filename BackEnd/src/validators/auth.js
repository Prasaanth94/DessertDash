const { body } = require("express-validator");

const validateRegistrationData = [
  body("username", "username is required").not().isEmpty(),
  body("HASH", "password is required").not().isEmpty(),
  body("HASH", "password min is 8 and max is 50").isLength({
    min: 8,
    max: 50,
  }),
  body("email", "email is required").not().isEmpty(),
  body("email", "valid email is required").isEmail(),
];

const validateLoginData = [
  body("email", "email is required").not().isEmpty().isEmail(),
  body("HASH", "password is required").not().isEmpty(),
];

module.exports = {
  validateRegistrationData,
};
