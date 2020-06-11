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
        'Ocp-Apim-Subscription-Key': process.env.NEWS_API_KEY,
      },
    };

    const {
      data: { value },
    } = await axios.get(
      `https://api.cognitive.microsoft.com/bing/v7.0/news/search?q=${query}%20currency&count=3`,
      config
    );
    res.json(value);
  } catch (error) {
    console.log(error.message);
    res.status(500).json('Server Error');
  }
});

module.exports = router;
