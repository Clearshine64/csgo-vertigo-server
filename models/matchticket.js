const mongoose = require('mongoose');

//match ticket is information for matching and log
const matchSchema = new mongoose.Schema({
  matchmode: {
    type: String,
    required: true,
  },
  lobby :{
    firstgroupid: String,
    secondgroupid: String
  },
  score: {
    firstgroup: Number,
    secondgroup: Number
  },
  priority: {
    firstgroup: Number,  //1: start clicker first
    secondgroup: Number  //2: start clicker second
  },
  status: {         //"initial", "processing" ,"processed"
    type: String,
    required: true
  },

});

// matches : [{
//   matchmode: "openrank",
//   firstgroup:{
//       "123",
//       "234",
//       "345",
//       "456",
//       "789"
//   }
//   secondgroup:{
//       "111",
//       "222",
//       "333",
//       "444",
//       "555"
//   }
//   score :{
//       firstgroup: 16,
//       secondgroup: 3
//   }
//   status: "processing"
// }]
module.exports = mongoose.model('matchticket', matchSchema);