const express = require('express');
const app = express();
const expressWs = require('express-ws')(app);
const serveStatic = require('serve-static');
const bodyParser = require('body-parser');
const path = require('path');
const { node } = require('prop-types');

//steamapi.js is for filtering accounts whether it can't be used
// var exec = require('child_process').exec;
// let child = exec('node steamapi.js', // Spawn the process, with an item from your array as an argument.
//   function (error, stdout, stderr) {
//     console.log('Grouping is done');
//   });

require('./models/db'); // for initial connect to Mongo DB
const SteamLib = require('./lib/steamlib');

app.set('port', process.env.PORT || 4000);

//for test page to determine whether socket is working
app.use('/', serveStatic(`${__dirname}/public`));
app.use('/socket/browser', serveStatic(`${__dirname}/public`));
app.use('/socket/vbclient', serveStatic(`${__dirname}/public`));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(require('cors')());
app.use(require('helmet')());

//route modules
app.use('/api/accounts', require('./routes/accounts'));
app.use('/api/clients', require('./routes/clients'));
app.use('/api/match', require('./routes/match'));

if (process.env.NODE_ENV == 'test')
  console.log("rank mode is test");

if (process.env.NODE_ENV == 'wingman')
  console.log("rank mode is wingman");

if (process.env.NODE_ENV == "competitive")
  console.log("rank mode is competitive");

// Production
if (process.env.NODE_ENV === 'production') {
  // Set static folder
  app.use(express.static('client/build'));

  app.get('*', (req, res) => {
    res.sendfile(path.resolve(__dirname, 'client', 'build', 'index.html'));
  });
}

//socket modules
app.ws('/socket/browser', require('./socket/websocket').websocketfunction);
app.ws('/socket/vbclient', require('./socket/vbsocket').websocketfunction);

async function main() {
  await SteamLib.initial();
  app.listen(app.get('port'), 'localhost', () => {
    console.log('Server listening on port %s', app.get('port'));
  });
}

main();