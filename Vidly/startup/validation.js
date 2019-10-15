const Joi = require("joi");

module.exports = function() {
  console.log("validation");
  Joi.objectId = require("joi-objectid")(Joi);
};
