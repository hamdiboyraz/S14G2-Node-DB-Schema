const express = require("express");
const carsController = require("./cars-model");
const carsMiddleware = require("./cars-middleware");

const router = express.Router();

router.get("/", async (req, res, next) => {
  try {
    const cars = await carsController.getAll();
    res.status(200).json(cars);
  } catch (error) {
    next(error);
  }
});
router.get("/:id", carsMiddleware.checkCarId, async (req, res, next) => {
  try {
    const { car } = req;
    res.status(200).json(car);
  } catch (error) {
    next(error);
  }
});
router.post(
  "/",
  carsMiddleware.checkCarPayload,
  carsMiddleware.checkVinNumberValid,
  carsMiddleware.checkVinNumberUnique,
  async (req, res, next) => {
    try {
      const { vin, make, model, mileage, title, transmission } = req.body;

      const newCar = await carsController.create({
        vin,
        make,
        model,
        mileage,
        title,
        transmission,
      });
      res.status(201).json(newCar);
    } catch (error) {
      next(error);
    }
  }
);

module.exports = router;
