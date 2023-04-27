const vinValidator = require("vin-validator");
const carsController = require("./cars-model");

exports.checkCarId = async (req, res, next) => {
  console.log("hi");

  try {
    const { id } = req.params;
    const car = await carsController.getById(id);
    if (!car) return res.status(404).json({ message: "Car not found!" });
    req.car = car;
    next();
  } catch (error) {
    next(error);
  }
};

exports.checkCarPayload = (req, res, next) => {
  try {
    const fields = ["vin", "make", "model", "mileage"];
    let missedFields = [];
    for (let i = 0; i < fields.length; i++) {
      const item = fields[i];
      if (!req.body[item]) {
        missedFields.push(item);
      }
    }
    if (missedFields.length > 0) {
      return res.status(400).json({
        message: `${missedFields.toString()} ${
          missedFields.length == 1 ? "is" : "are"
        } missing`,
      });
    }
    next();
  } catch (error) {
    next(error);
  }
};

exports.checkVinNumberValid = (req, res, next) => {
  try {
    const { vin } = req.body;
    var isValidVin = vinValidator.validate(vin);
    if (!isValidVin) {
      return res.status(400).json({ message: `vin ${vin} is invalid` });
    }
    next();
  } catch (error) {
    next(error);
  }
};

exports.checkVinNumberUnique = async (req, res, next) => {
  try {
    const { vin } = req.body;
    const isVinUnique = await carsController.getByVin(vin);
    if (isVinUnique) {
      return res
        .status(400)
        .json({ message: `vin ${req.body.vin} already exists` });
    }
    next();
  } catch (error) {
    next(error);
  }
};
