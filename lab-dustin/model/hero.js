'use strict';

const mongoose = require('mongoose');
const heroSchema = mongoose.Schema({
  name: {type: String, required: true},
  goodOrEvil: {type: String, required: true},
  origin: {type: String, required: true, unique: true},
  dateCreated: {type: Date, default: Date.now},
});

const Hero = module.exports = mongoose.model('hero', heroSchema);
