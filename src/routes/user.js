const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { check, validationResult } = require('express-validator');

const User = require('../models/User');
const Currency = require('../models/Currency');
const auth = require('../middleware/auth');

const router = express.Router();

// @route   Post /api/user/
// @desc    Create a user
// @access  Public

router.post(
  '/',
  [
    check('name', 'Name is required')
      .not()
      .isEmpty(),
    check('email', 'Please include a valid email').isEmail(),
    check(
      'password',
      'Please enter a password with 6 or more characters'
    ).isLength({ min: 6 }),
  ],
  async (req, res) => {
    try {
      // check if theres any errors with the request body parameters
      const errors = validationResult(req);

      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }
      // validate for errors (if all fields have been provided)
      const { name, email, password } = req.body;

      // check if the email is already created
      let user = await User.findOne({ email });
      // if exists, throw an error (400)
      if (user) {
        return res
          .status(400)
          .json({ errors: [{ msg: 'User already exists' }] });
      }

      // if doesnt exist, create new User instance
      user = new User({
        name,
        email,
        password,
      });

      // encrypt password in User object with bcrypt
      const salt = await bcrypt.genSalt(10);

      user.password = await bcrypt.hash(password, salt);

      await user.save();

      // create token to be sent to front end via JWT
      const payload = {
        user: {
          id: user.id,
        },
      };

      jwt.sign(
        payload,
        process.env.JWT_SECRET,
        { expiresIn: 3600 },
        (err, token) => {
          if (err) {
            throw new Error(err);
          } else {
            return res.status(200).json({ token });
          }
        }
      );

      // handle error within JWT tokenization
    } catch (error) {
      console.log(error.message);
      res.status(500).send('Server Error');
    }
  }
);

// @route   DELETE /api/user/
// @desc    Delete a user
// @access  Private

router.delete('/', auth, async (req, res) => {
  // find currency collection owned by user & delete
  await Currency.deleteMany({ user: req.user.id });
  // find user
  const user = await User.findOne({ _id: req.user.id });
  // if user exists remove user
  if (user) {
    await user.remove();
  }

  res.json({ msg: 'User deleted' });
});

module.exports = router;
