const mongoose = require('mongoose');
const { string } = require('prop-types');

const configSchema = new mongoose.Schema({
  map: [{
    type: String,
    required: true,
  }],
  matchmode: {    //match config
    openrank: {
      map: String,
      condition: Number
    },
    onlylose: {
      map: String,
      condition: Number
    },
    level: {
      map: String,
      condition: Number
    }
    
  },
  filteringflag: {   //for race condition
    type: Boolean,
    default: Boolean.false
  },
  grouptype: {
    type: String,
    default: "competitve" //competitive, wingman
  },
  gamestarting: {
    openrank: Boolean,
    onlylose: Boolean,
    level: Boolean,
  }
});

module.exports = mongoose.model('config', configSchema);