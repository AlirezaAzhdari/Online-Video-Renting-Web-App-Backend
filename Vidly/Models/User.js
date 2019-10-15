const mongoose = require("mongoose");
const Joi = require("joi");
const valiadator = require("validator");
const config = require("config");
const jwt = require("jsonwebtoken");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minlength: 3,
    maxlength: 255,
    trim: true,
    unique: true
  },
  email: {
    type: String,
    required: true,
    minlength: 1,
    trim: true,
    unique: true,
    validate: {
      validator: valiadator.isEmail,
      message: "{Value is not a valid email}"
    }
  },
  password: {
    type: String,
    required: true,
    minlength: 6,
    maxlength: 1024
  },
  isAdmin: Boolean
});
//Joi password complexity

function validateUser(user, method) {
  const schema1 = {
    name: Joi.string()
      .required()
      .min(3)
      .max(255),
    email: Joi.string()
      .required()
      .min(1)
      .email(),
    password: Joi.string()
      .required()
      .min(6)
      .max(255)
  };

  const schema2 = {
    email: Joi.string()
      .required()
      .min(1)
      .email(),
    password: Joi.string()
      .required()
      .min(6)
      .max(255)
  };

  if (method === "register") return Joi.validate(user, schema1);
  return Joi.validate(user, schema2);
}

userSchema.methods.generateAuthToken = function() {
  const token = jwt.sign(
    { _id: this._id, isAdmin: this.isAdmin },
    config.get("jwtPrivateKey"),
    {
      expiresIn: 86400
    }
  );
  return token;
};

const User = mongoose.model("User", userSchema);

exports.User = User;
exports.validate = validateUser;
