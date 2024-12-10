const mongoose = require('mongoose');

const studentSchema = new mongoose.Schema({
  name: { type: String, required: true },
  phone: { type: Number, required: true, unique: true },
  time: { type: Date, default: Date.now },
  index: { type: Number, unique: true },
  allocatedMan: { type: String },
});

studentSchema.pre('save', async function (next) {
  if (!this.isNew) return next();

  try {
    const lastStudent = await this.constructor.findOne({}, {}, { sort: { index: -1 } });
    this.index = lastStudent ? lastStudent.index + 1 : 1;
    next();
  } catch (err) {
    next(err);
  }
});

module.exports = mongoose.model('Student', studentSchema);
