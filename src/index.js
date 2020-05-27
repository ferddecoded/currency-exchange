require('dotenv').config();
const express = require('express');
// const path = require('path');

// routes
const newsRoutes = require('./routes/news');

// initialize app
const app = express();

// Init Middleware
// this will allow us to get the data in req.body
app.use(express.json({ extended: false }));

app.use('/api/currency', () => {});
app.use('/api/news', newsRoutes);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
