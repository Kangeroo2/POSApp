const mongoose = require('mongoose');

const vendorSchema = mongoose.Schema({
  vendorName: { type: String, required: true },
  firstName: { type: String, required: true },
  lastName: { type: String, required: true},
  commission: { type: String, require: true},
  email: { type: String, required: true },
  phoneNumber: { type: String, required: true },
  address: { type: String, required: true },
  startDate: { type: String, required: true},
  rentAmount: { type: String, required: true},
  contractLength: { type: String, required: true},
  imagePath: { type: String }
});

module.exports = mongoose.model('Vendor', vendorSchema);

