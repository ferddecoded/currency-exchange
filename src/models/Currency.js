const mongoose = require('mongoose');

const CurrencySchema = mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user',
  },
  currencies: [
    {
      currency: { type: String, required: true, unique: true },
      index: { type: Number, required: true, unique: true },
    },
  ],
});

module.exports = mongoose.model('currency', CurrencySchema);
