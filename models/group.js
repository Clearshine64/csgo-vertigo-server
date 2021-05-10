const mongoose = require('mongoose');

//group information is information and log
const groupSchema = new mongoose.Schema({
  matchmode: {          //"openrank", "onlylose", "level"
    type: String,
    required: true,
    trim: true
  },
  //get status information from treamleader
  teamleaderid: {
    type: String,
    required: true,
  },
  accountids: {
    type: Array,
  },
  useful: {   //this information refers that this group is already assigend to clients or already finished: true => not assigned, false => assigned
    type: Boolean,
    required: true
  }
});

module.exports = mongoose.model('group', groupSchema);