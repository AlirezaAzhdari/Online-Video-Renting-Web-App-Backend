const mongoose = require("mongoose");
const Joi = require("joi");

const customerSchema = new mongoose.Schema({
  name: {
    type: String,
    require: true,
    unique: true,
    mingLength: 3,
    maxlength: 100
  },
  phone: {
    type: Number,
    required: true,
    minlength: 11,
    maxlength: 12
  },
  isPremier: {
    type: Boolean,
    default: false
  }
});

function validateCustomer(customer) {
  const schema = {
    name: Joi.string()
      .min(3)
      .max(100)
      .required(),
    phone: Joi.number()
      .min(11)
      .max(12)
      .required(),
    isPremier: Joi.boolean()
  };

  return Joi.validate(customer, schema);
}

const Customer = mongoose.model("Customer", customerSchema);

exports.Customer = Customer;
exports.validate = validateCustomer;
