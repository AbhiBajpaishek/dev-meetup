const validator = require("validator");

const signUpRequestValidator = (req) => {
  const { firstName, lastName, emailId, password, skills } = req.body;

  // validate signup request
  const ALLOWED_FIELDS = [
    "firstName",
    "emailId",
    "lastName",
    "password",
    "age",
    "gender",
    "skills",
    "photoUrl",
  ];
  const notAllowedFields = Object.keys(req.body).filter(
    (field) => !ALLOWED_FIELDS.includes(field)
  );
  if (notAllowedFields.length > 0) {
    throw new Error(
      "Bad Request. Fields not allowed: " + notAllowedFields.toString()
    );
  }

  // validate size of skills field
  if (skills && skills.length > 10)
    throw new Error("Bad Request: Skills length cannot be more than 10");

  if (!firstName || !lastName) {
    throw new Error("Name is required");
  }
  if (!validator.isEmail(emailId)) {
    throw new Error("Email Id is not valid");
  }
  if (!validator.isStrongPassword(password)) {
    throw new Error("Enter a strong password");
  }
};

const profileUpdateRequestValidator = (req) => {
  const userBody = req.body;
  const ALLOWED_FIELDS = [
    "firstName",
    "lastName",,
    "age",
    "gender",
    "skills",
    "photoUrl",
  ];
  const notAllowedFields = Object.keys(userBody).filter(
    (field) => !ALLOWED_FIELDS.includes(field)
  );
  if (notAllowedFields.length > 0) {
    throw new Error(
      "Bad Request. Fields not allowed: " + notAllowedFields.toString()
    );
  }

  // validate size of skills field
  const skills = userBody.skills;
  if (skills && skills.length > 10)
    throw new Error("Bad Request: Skills length cannot be more than 10");
};

module.exports = { signUpRequestValidator, profileUpdateRequestValidator };
