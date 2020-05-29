const mongoose = require('mongoose');

const CurrencySchema = mongoose.Schema({
  currency: { type: String, required: true },
  index: { type: Number, required: true },
});

module.exports = mongoose.model('currency', CurrencySchema);
