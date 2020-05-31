require('dotenv').config();
const express = require('express');
const connectDB = require('./config/db');
// const path = require('path');

// routes
const newsRoutes = require('./routes/news');
const exchangeRatesRoutes = require('./routes/exchangeRates');
const currencyDataRoutes = require('./routes/currencyData');
const userRoutes = require('./routes/user');
const authRoutes = require('./routes/auth');
const currenciesRoutes = require('./routes/currency');

// initialize app
const app = express();

connectDB();

// Init Middleware
// this will allow us to get the data in req.body
app.use(express.json({ extended: false }));

app.use('/api/exchangeRates', exchangeRatesRoutes);
app.use('/api/news', newsRoutes);
app.use('/api/currencyData', currencyDataRoutes);
app.use('/api/users', userRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/currency', currenciesRoutes);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
