const express = require("express");
const router = express.Router();
const { Customer, validate } = require("../Models/Customer");
const auth = require("../middleware/auth");
const admin = require("../middleware/admin");
const asyncMiddleware = require("../middleware/async");

//Get
router.get(
  "/",
  asyncMiddleware((req, res) => {
    Customer.find()
      .sort("name")
      .then(customers => {
        if (customers) {
          return res.json(customers);
        }
        res.status(404).send("There is no customer yet...");
      });
  })
);

//Get
router.get(
  "/:id",
  asyncMiddleware((req, res) => {
    Customer.findById(req.params.id).then(customer => {
      if (!customer) {
        return res.status(404).send("Customer Was Not Found");
      }

      res.json(customer);
    });
  })
);

//Post
router.post(
  "/",
  auth,
  asyncMiddleware((req, res) => {
    const { error } = validate(req.body);
    if (error) {
      return res.status(400).send(error.details[0].message);
    }

    Customer.findOne({ name: req.body.name }).then(customer => {
      if (customer) {
        return res.status(400).send("This customer is already created");
      }

      const newCustomer = new Customer({
        name: req.body.name,
        phone: req.body.phone
      });
      newCustomer
        .save()
        .then(customer => res.status(200).json(customer))
        .catch(err => res.send(err.message));
    });
  })
);

//Put
router.put(
  "/:id",
  auth,
  admin,
  asyncMiddleware((req, res) => {
    const { error } = validate(req.body);
    if (error) {
      return res.status(400).send(error.details[0].message);
    }

    Customer.findByIdAndUpdate(
      req.params.id,
      { name: req.body.name },
      { new: true }
    ).then(customer => {
      if (!customer) {
        return res.status(400).send("This customer does not exist");
      }
      res.status(200).send(customer);
    });
  })
);

//Delete
router.delete(
  "/:id",
  auth,
  admin,
  asyncMiddleware((req, res) => {
    Customer.findByIdAndRemove(req.params.id).then(customer => {
      if (!customer) {
        return res.status(404).send("This customer does not exist");
      }
      res.json({ message: "customer is removed" });
    });
  })
);

module.exports = router;
