const express = require("express");
const router = express.Router();
const { Genre, validate } = require("../Models/Genre");
const auth = require("../middleware/auth");
const admin = require("../middleware/admin");
const asyncMiddleware = require("../middleware/async");
const validateObjectId = require("../middleware/validateObjectId");

//Get
router.get(
  "/",
  asyncMiddleware((req, res) => {
    Genre.find()
      .sort("name")
      .then(genres => {
        if (genres) {
          return res.json(genres);
        }
        res.status(404).send("There is no genre yet...");
      });
  })
);

router.get(
  "/:id",
  validateObjectId,
  asyncMiddleware((req, res) => {
    Genre.findById(req.params.id).then(genre => {
      if (!genre) {
        return res.status(404).send("Genre Was Not Found");
      }

      res.json(genre);
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

    Genre.findOne({ name: req.body.name }).then(genre => {
      if (genre) {
        return res.status(400).send("This genre is already created");
      }

      const newGenre = new Genre({
        name: req.body.name
      });
      newGenre.save().then(genre => res.status(200).json(genre));
    });
  })
);

//Put
router.put(
  "/:id",
  auth,
  admin,
  validateObjectId,
  asyncMiddleware((req, res) => {
    const { error } = validate(req.body);
    if (error) {
      return res.status(400).send(error.details[0].message);
    }

    Genre.findByIdAndUpdate(
      req.params.id,
      { name: req.body.name },
      { new: true }
    ).then(genre => {
      if (!genre) {
        return res.status(400).send("This genre does not exist");
      }
      res.status(200).send(genre);
    });
  })
);

//Delete
router.delete(
  "/:id",
  auth,
  admin,
  validateObjectId,
  asyncMiddleware((req, res) => {
    Genre.findByIdAndRemove(req.params.id).then(genre => {
      if (!genre) {
        return res.status(404).send("This genre does not exist");
      }
      res.json({ message: "genre is removed" });
    });
  })
);

module.exports = router;
