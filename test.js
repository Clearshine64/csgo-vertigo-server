const fs = require('fs');
const SteamUser = require('steam-user');
const SteamTotp = require('steam-totp');
const GlobalOffensive = require('globaloffensive');
var SteamID = require('steamid');

const SteamLib = require('./lib/steamlib');
const AccountLib = require('./lib/accountlib');
const ConfigLib = require('./lib/configlib');
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

function isLosed(accounts, condition) {
    for (let account of accounts) {
        if (account.profile_after && account.profile_before) {
            let losed = account.profile_after.losed || 0;
            console.log("losed times " + losed);
            if (losed < condition)
                return false;
        }
        else return false;
    }

    return true;
}

function isLeveled(accounts, condition) {
    for (let account of accounts) {
        if (account.profile_after && account.profile_before) {
            let leveled = account.profile_after.leveled || 0;
            console.log("leveled times " + leveled);
            if (leveled < condition)
                return false;
        }
        else return false;
    }

    return true;
}

const check_level = async (mode, groupid) => {
    try {
        let condition = await ConfigLib.getMatchInfo(mode);
        let faccounts = await SteamLib.getAllAccountsInGroup(groupid);

        console.log("level condition is " + condition.condition);
        
        let flag = false;

        if (await isLeveled(faccounts, condition.condition)) {
            flag = true;
            console.log(groupid + " is losed for all level conditions")
            //await setAccountsFlagDescInGroup(groupid, "processed", "leveled");
        }
        else 
            console.log("not")
        return flag;
    } catch (err) {
        console.log(err);
        throw err;
    }
}

const check_only_lose = async (mode, groupid) => {
    try {
        let condition = await ConfigLib.getMatchInfo(mode);
        let faccounts = await SteamLib.getAllAccountsInGroup(groupid);
        
        console.log("lose condition is " + condition.condition);

        let flag = false;

        if (await isLosed(faccounts, condition.condition)) {
            flag = true;
            console.log(groupid + " is losed for all lose conditions")
            //await setAccountsFlagDescInGroup(groupid, "processed", "losed");
        }

        return flag;
    } catch (err) {
        console.log(err);
        throw err;
    }
}

const main = async () => {
    check_only_lose("onlylose", "60a58d57500a265884f892c9");
    check_level("level", "60a591e5500a265884f892cb");

}

main();
