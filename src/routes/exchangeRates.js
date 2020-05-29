const express = require('express');
const axios = require('axios');

const router = express.Router();

// @route   GET /api/currency/:query
// @desc    Get currency rates based on query
// @access  Public

router.get('/:query', async (req, res) => {
  try {
    const { query } = req.params;

    if (!query) {
      return res.status(400).json({ msg: 'No query provided' });
    }

    const { data } = await axios.get(
      `https://api.exchangeratesapi.io/latest?base=${query}`
    );
    res.json(data);
  } catch (error) {
    console.log(error.message);
    res.status(500).json('Server Error');
  }
});

module.exports = router;
