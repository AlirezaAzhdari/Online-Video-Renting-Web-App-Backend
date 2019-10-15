const express = require("express");
const Fawn = require("fawn");
const router = express.Router();
const { Rental, validate } = require("../Models/Rental");
const { Customer } = require("../Models/Customer");
const { Movie } = require("../Models/Movie");
const auth = require("../middleware/auth");
const asyncMiddleware = require("../middleware/async");

//Post
router.post(
  "/",
  auth,
  asyncMiddleware(async (req, res) => {
    const { error } = validate(req.body);
    if (error) {
      return res.status(400).send({ message: error.details[0].message });
    }
    const _customer = await Customer.findById(req.body.customerId);
    if (!_customer) {
      return res.status(400).send("This Customer does not exist");
    }
    const movie = await Movie.findById(req.body.movieId);
    if (!movie) {
      return res.status(400).send("This Movie does not exist");
    }

    if (movie.numberInStock === 0) {
      return res.status(400).send("Movie is not available");
    }

    let newRental = new Rental({
      customer: {
        _id: _customer._id,
        name: _customer.name,
        phone: _customer.phone,
        isPremier: _customer.isPremier
      },
      movie: {
        _id: movie._id,
        title: movie.title,
        dailyRentalRate: movie.dailyRentalRate
      }
    });

    new Fawn.Task()
      .save("rentals", newRental)
      .update("movies", { _id: movie._id }, { $inc: { numberInStock: -1 } });

    res.status(200).json(result);
  })
);

router.get(
  "/:id",
  asyncMiddleware(async (req, res) => {
    const rental = await Rental.findById(req.params.id);

    if (!rental)
      return res
        .status(404)
        .send("The rental with the given ID was not found.");

    res.json(rental);
  })
);

module.exports = router;
