const express = require('express');

const auth = require('../middleware/auth');
const Currencies = require('../models/Currency');

const router = express.Router();

// @route   GET /api/currency
// @desc    Get user's currencies data
// @access  Public

router.get('/', auth, async (req, res) => {
  try {
    // find user's currencies data
    const currencies = await Currencies.findOne({
      user: req.user.id,
    }).populate('user', ['name', 'date']);

    if (!currencies) {
      return res
        .status(404)
        .json({ msg: 'There is no currencies for this user' });
    }

    res.json(currencies);
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Server Error');
  }
});

// @route   POST /api/currency
// @desc    update user's currency array
// @access  Private

router.post('/', auth, async (req, res) => {
  // post currency array to user's currency item object
  try {
    // get currency array from req
    const { currencies } = req.body;

    const currencyFields = {
      user: req.user.id,
      currencies,
    };

    // check if currenciesModel exists, if it doesnt create new instance
    let currenciesModel = await Currencies.findOne({ user: req.user.id });

    if (!currenciesModel) {
      currenciesModel = await new Currencies(currencyFields);

      await currenciesModel.save();

      res.json(currenciesModel);
    } else {
      // if does exist, update
      currenciesModel = await Currencies.findOneAndUpdate(
        { user: req.user.id },
        { $set: currencyFields },
        { new: true }
      );

      await currenciesModel.save();

      return res.json(currenciesModel);
    }
  } catch (error) {
    console.error(error.message);
    res.status(500).status('Server Error');
  }
});

module.exports = router;
