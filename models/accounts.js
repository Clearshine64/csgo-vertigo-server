const mongoose = require('mongoose');

const accountSchema = new mongoose.Schema({
  matchmode: {          //"openrank", "onlylose", "level"
    type: String,
    required: true,
    trim: true
  },
  status: {
    flag: {
      type: String,     //"initial", "notuseful", "useful", "grouped", "processed", "notprocessed"
      required: true,
      trim: true
    },
  },
  des: {
    type: String      //reason of "notuseful", "notprocessed"
  },
  username: {
    type: String,
    required: true,
    trim: true
  },
  password: {
    type: String,
    required: true,
    trim: true
  },
  profile_before: {       //profile status before match
    type: Map
  },
  profile_after: {        //profile status after all
    type: Map
  }
});

module.exports = mongoose.model('accounts', accountSchema);
