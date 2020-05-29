const mongoose = require('mongoose');

const CurrencySchema = mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user',
  },
  currencies: [
    {
      currency: { type: String, required: true },
      index: { type: Number, required: true },
    },
  ],
});

module.exports = mongoose.model('currency', CurrencySchema);
