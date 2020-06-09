const express = require('express');
const axios = require('axios');

const router = express.Router();

// @route   GET /api/news/:query
// @desc    Get news related to currency
// @access  Public

router.get('/:query', async (req, res) => {
  try {
    const { query } = req.params;

    if (!query) {
      return res.status(400).json({ msg: 'No query provided' });
    }

    const config = {
      headers: {
        'X-API-Key': process.env.NEWS_API_KEY,
      },
    };

    const { data } = await axios
      .get(
        `https://newsapi.org/v2/everything?q=${query}%20currency&pageSize=3`,
        config
      )
      .catch(() => []);
    res.json(data);
  } catch (error) {
    console.log(error.message);
    res.status(500).json('Server Error');
  }
});

module.exports = router;
