const mongoose = require('mongoose');

//cpu
//totalmemory
//availablememory

const clientSchema = new mongoose.Schema({
  matchmode: {          //"openrank", "onlylose", "level"
    type: String,
    required: true,
    trim: true
  },
  clientip: {
    type: String,
    required: true,
    trim: true
  },
  capacity: {
    type: Number,       //number of groups that client can run
    required: true
  },
  useful: { //  online(true)/offline(false) 
    type: Boolean,
    default: Boolean.false
  },
  res: {              //Resource of vbclient
    cpu: Number,
    availableRam: Number,
    totalRam: Number
  },
  groupids: {
    type: Array
  },
  time_updated: Number
});

module.exports = mongoose.model('clients', clientSchema);