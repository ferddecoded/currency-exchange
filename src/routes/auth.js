const express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { check, validationResult } = require('express-validator');
const auth = require('../middleware/auth');

const router = express.Router();
const User = require('../models/User');

// @route   GET /api/auth
// @desc    get user by token
// @access  Private

// this middleware is used to get the user instance from the token
router.get('/', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');

    if (!user) {
      return res.status(404).json({ errors: [{ msg: 'User does not exist' }] });
    }
    res.json(user);
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Server Error');
  }
});

// @route   POST /api/auth
// @desc    Authenticate user and get token
// @access  Public

// middleware to login and get token to front end
router.post(
  '/',
  [
    check('email', 'Please include a valid email').isEmail(),
    check('password', 'Password is required').exists(),
  ],
  async (req, res) => {
    try {
      // check if there are any errors with req.body
      const errors = validationResult(req);
      // if there are errors, return with errors array
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const { email, password } = req.body;

      // find user by email
      const user = await User.findOne({ email: email.toLowerCase() });

      if (!user) {
        return res
          .status(400)
          .json({ errors: [{ msg: 'Invalid credentials' }] });
      }
      // check if passwords match with bcrypt
      const isMatched = await bcrypt.compare(password, user.password);

      if (!isMatched) {
        return res
          .status(400)
          .json({ errors: [{ msg: 'Invalid credentials' }] });
      }

      // create payload for jwtoken
      const payload = {
        user: {
          id: user.id,
        },
      };

      // sign with jwt to create token and return to front end
      jwt.sign(
        payload,
        process.env.JWT_SECRET,
        { expiresIn: 3600 },
        (error, token) => {
          if (error) {
            throw error;
          }
          res.json({ token });
        }
      );
    } catch (error) {
      console.error(error.message);
      res.status(500).status('Server Error');
    }
  }
);

module.exports = router;
