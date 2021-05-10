const {
  json
} = require("body-parser");

const SteamLib = require('../lib/steamlib');

const ClientLib = require("../lib/clientlib");

const messages = {
  registered: "{'action': 'registered'}",
  notregistered: "{'action': 'not registered'}",
}

/* config */
let timeinterval = 5000;
let disconnectTime = 5; // 5000 * 5 = 25s

let timeflag = false;

//connected clients list
let vbconnects = [];

//in this list client which has problem such as more than 2 clients have same ip
let blacklist = [];

//check if client is alive and send status
setInterval(async () => {
  try {
    if (!timeflag) {
      timeflag = true;
      //ping to every clients
      for (const vbclient of vbconnects) {

        if (vbclient.isAlive === false) {
          console.log(vbclient.ipv4 + "not alive");
          await ClientLib.setUsefulFlag(vbclient.ipv4, false);
          vbclient.terminate();
        } else {
          //this pingcount is set to zero from pong
          vbclient.pingcount++;

          //if 5 ping is failed, determine client is not connected
          if (vbclient.pingcount == disconnectTime) {
            vbclient.isAlive = false;
          }
          await vbclient.ping(() => { });
        }
      }

      timeflag = false;
    }

  } catch (err) {
    console.log(err);
  }
}, timeinterval);

//check client's connection for first time, whether it is registered or not.
const FirstConnectionCheck = async (ws, ipv4) => {
  try {
    //let reg = /\b\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}\b/; //for ipv4
    ws.isAlive = true;
    ws.ipv4 = ipv4;

    if (blacklist.indexOf(ws.ipv4) != -1) {
      console.log(ws.ipv4 + " is in blacklist");
      return;
    }

    ws.pingcount = 0;

    console.log(ws.ipv4 + " vbclient is established");
    let flag = 0; //flag for black list, if this flag is set don't push to vbconnects
    //check if new connection is already connected
    for (const vbclient of vbconnects) {
      if (vbclient.ipv4 == ws.ipv4) {
        flag = 1;
        blacklist.push(vbclient.ipv4);
        console.log("ws.ipv4 is already connected");
        vbclient.terminate();
      }
    }

    if (!flag)
    {
      vbconnects.push(ws);

      // console.log(vbconnects);
      if (!await ClientLib.isRegistered(ws.ipv4)) {
        console.log(messages.notregistered);
        ws.send(messages.notregistered);
        ws.terminate();
      } else {
        console.log(messages.registered);
        ws.send(messages.registered);
      }
    }

  } catch (err) {
    console.log(err);
  }

}

//when socket connection is established
const websocketfunction = async (ws, req) => {
  //poin if from alive client and send client's information
  const onPongAction = async (vbclient) => {
    try {
      if (await ClientLib.isRegistered(vbclient.ipv4)) {
        await ClientLib.setUsefulFlag(vbclient.ipv4, true);
        //send all info such as resource and group info to vbclient
        let infomessage = await SteamLib.getInfoForVbclient(vbclient.ipv4);

        await vbclient.send(JSON.stringify(infomessage));

        vbclient.pingcount = 0;

        vbclient.isAlive = true;
      } else {
        await vbclient.send(messages.notregistered);
        await vbclient.terminate();
        console.log("ping check: " + vbclient.ipv4 + " vbclient is not registered");
      }
    } catch (err) {
      console.log(err);
    }
  }

  const onMessageAction = async (ws, message) => {
    try {
      let jsonMsg = JSON.parse(message)

      switch (jsonMsg.action) {
        case "register":
          await FirstConnectionCheck(ws, jsonMsg.ipv4);
          return;
        default:
          break;
      }

      for (const vbclient of vbconnects) {
        if (vbclient == ws) {
          let json = JSON.parse(message);

          switch (json.action) {
            case "resource":
              await ClientLib.updateResource(vbclient.ipv4, json);
              break;

            //set accounts flag in this group to "notprocessed"
            case "lobby error":
              console.log("lobby " + json.groupid + " can't be run");

              await SteamLib.setAccountsFlagDescInGroup(json.groupid, "notprocessed", "error occured while starting on client");
              break;
            default:
              //don't call await because it shold be done async
              SteamLib.matchManage(json, vbclient);
              break;
          }
        }
      }
    } catch (err) {
      console.log(err);
    }
  }

  ws.on('pong', () => {
    for (const vbclient of vbconnects) {
      if (vbclient == ws) {
        onPongAction(vbclient);
      }
    }
  });

  ws.on('message', message => {
    try {
      onMessageAction(ws, message);
    } catch (err) {
      console.log(err);
    }
  });

  ws.on('close', () => {
    vbconnects = vbconnects.filter(conn => {
      if (conn === ws) {
        ClientLib.setUsefulFlag(conn.ipv4, false);
        console.log(conn.ipv4 + " vbclient is terminated");
        return false;
      } else {
        return true;
      }
    });
  });
};

const websocket = {
  websocketfunction,
  vbconnects
}

module.exports = websocket;