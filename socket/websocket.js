const SteamLib = require('../lib/steamlib');

let browserConnects = [];

/* config */
let timeinterval = 5000;
let timeflag = false;

//send realtime data to web browser
setInterval(async () => {
  if (!timeflag) {
    try {
      timeflag = true;
      let data = {};
      data.openrank = await SteamLib.getBrowserRealtimeInfo("openrank") || {};
      data.onlylose = await SteamLib.getBrowserRealtimeInfo("onlylose") || {};
      data.level = await SteamLib.getBrowserRealtimeInfo("level") || {};

      browserConnects.forEach((client) => {
        client.send(JSON.stringify(data));
      });
      timeflag = false;
    } catch (err) {
      console.log(err);
    }
  }
}, timeinterval);

// websocket function
const websocketfunction = (ws, req) => {
  console.log(req.socket.remoteAddress + " browser socket is established");
  browserConnects.push(ws);

  ws.on('message', message => {
    console.log('Socket message received -', message);

    browserConnects.forEach(socket => {
      socket.send(message);
    });
  });

  ws.on('close', () => {
    browserConnects = browserConnects.filter(conn => {
      return (conn === ws) ? false : true;
    });
  });
};

const websocket = {
  websocketfunction,
}

module.exports = websocket;