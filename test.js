const fs = require('fs');
const SteamUser = require('steam-user');
const SteamTotp = require('steam-totp');
const GlobalOffensive = require('globaloffensive');
var SteamID = require('steamid');

const SteamLib = require('./lib/steamlib');
const AccountLib = require('./lib/accountlib');

/* config */
let timeinterval = 10000;
let leveledTime = 1000 * 60 * 60 * 24 * 7;

let timeflag = false;
global_config = {
    accounts: 2, //5:Matchmaking, 2: Wingman
    rank_type_id: 7, //6: Matchmaking, 7: Wingman, 10: Danger Zone
    winscore: 8 //8:wingman, 16:Matchmaking
}
if (process.env.NODE_ENV == 'test') {
    global_config = {
        accounts: 2, //5:Matchmaking, 2: Wingman
        rank_type_id: 7, //6: Matchmaking, 7: Wingman, 10: Danger Zone
        winscore: 8 //8:wingman, 16:Matchmaking
    }
    timeinterval = 1000;
}

if (process.env.NODE_ENV == 'wingman') {
    global_config = {
        accounts: 2, //5:Matchmaking, 2: Wingman
        rank_type_id: 7, //6: Matchmaking, 7: Wingman, 10: Danger Zone
        winscore: 8 //8:wingman, 16:Matchmaking
    }
    timeinterval = 10000;
}

else if (process.env.NODE_ENV == "competitive") {
    global_config = {
        accounts: 5, //5:Matchmaking, 2: Wingman
        rank_type_id: 6, //6: Matchmaking, 7: Wingman, 10: Danger Zone
        winscore: 15 //8:wingman, 16:Matchmaking
    };
    timeinterval = 10000;
}

require('./models/db'); // for initial connect to Mongo DB

const main = async () => {

    let profile = await AccountLib.getProfileAfter("60a2caa8fdc4f327b005a94f");
    profile["ranking"] = profile["ranking"] || {};
    profile.ranking.rank_id = profile.ranking.rank_id || 0;
    profile.ranking.wins = profile.ranking.wins || 0;


    console.log("before wins = " + profile.ranking.wins);
    profile.ranking.wins = profile.ranking.wins + 1;
    console.log("now wins = " + profile.ranking.wins);

    console.log(profile);
}

main();
