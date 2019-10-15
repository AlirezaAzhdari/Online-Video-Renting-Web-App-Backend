const express = require("express");
const router = express.Router();
const { Movie, validate } = require("../Models/Movie");
const { Genre } = require("../Models/Genre");
const auth = require("../middleware/auth");
const admin = require("../middleware/admin");
const asyncMiddleware = require("../middleware/async");

//Get
router.get(
  "/",
  asyncMiddleware((req, res) => {
    Movie.find().then(movies => {
      if (!movies) {
        return res.status(404).send({ message: "No Movie Was Found" });
      }

      res.json(movies);
    });
  })
);

//Get:id
router.get(
  "/:id",
  asyncMiddleware((req, res) => {
    Movie.findById(req.params.id).then(movie => {
      if (!movie) {
        return res
          .status(404)
          .send({ message: "No Movie Was Found By This id" });
      }

      res.json(movie);
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
      return res.status(400).send({ message: error.details[0].message });
    }

    Genre.findById(req.body.genreId).then(genre => {
      if (!genre) {
        return res.status(400).send({ message: "This genre does not exist" });
      }

      const newMovie = new Movie({
        title: req.body.title,
        genre: {
          _id: genre._id,
          name: genre.name
        },
        dailyRentalRate: req.body.dailyRentalRate,
        numberInStock: req.body.numberInStock
      });

      newMovie
        .save()
        .then(movie => res.json(movie))
        .catch(err => res.send({ message: `error is: ${err.message}` }));
    });
  })
);

//Put
router.put(
  "/:id",
  auth,
  admin,
  asyncMiddleware((req, res) => {
    Movie.findByIdAndUpdate(
      req.params.id,
      {
        $set: {
          numberInStock: req.body.numberInStock
        }
      },
      {
        $new: true
      }
    ).then(movie => {
      if (!movie) {
        return res.status(400).send("This movie does not exist");
      }
      res.status(200).send(movie);
    });
  })
);

//Delete
router.delete(
  "/:id",
  auth,
  admin,
  asyncMiddleware((req, res) => {
    Movie.findByIdAndRemove(req.params.id).then(movie => {
      if (!movie) {
        return res.status(404).send("This movie does not exist");
      }
      res.json({ message: "movie is removed" });
    });
  })
);

module.exports = router;
