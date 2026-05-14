// models/systemSetting.model.js
const mongoose = require('mongoose');

const SystemSettingSchema = new mongoose.Schema({
  key: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },
  value: {
    type: mongoose.Schema.Types.Mixed, // allows any data type: String, Number, Boolean, Object, etc.
    required: true,
  },
  description: {
    type: String,
  },
  updated_at: {
    type: Date,
    default: Date.now,
  }
});

// Update updated_at on every save
SystemSettingSchema.pre('save', function(next) {
  this.updated_at = Date.now();
  next();
});

module.exports = mongoose.model('SystemSetting', SystemSettingSchema);
