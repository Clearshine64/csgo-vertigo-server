const fs = require('fs');
const SteamUser = require('steam-user');
const SteamTotp = require('steam-totp');
const GlobalOffensive = require('globaloffensive');
var SteamID = require('steamid');

const SteamLib = require('./lib/steamlib');

/* config */
let timeinterval = 10000;
let timeflag = false;
let global_config = {};

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

//log to log.txt
const logfunc = (data) => {
    try {
        //console.log(data);

        fs.writeFile('log.txt', data + "\n", { flag: 'a+' }, err => {
            if (err) {
                return;
            }
        });
    } catch (err) {

    }
}

//get profile of specific user using steamapi
const getProfile = async (username, password) => {

    let myPromise = new Promise((myResolve, myReject) => {
        let user = new SteamUser();
        let csgo = new GlobalOffensive(user);

        user.on('error', (err) => {
            if (err.toString().indexOf("InvalidPassword") != -1) {
                logfunc("InvalidPassword");
                myResolve("InvalidPassword");
            }
            else {
                // logfunc(err.toString());
                myResolve(err.toString());
            }
        });

        const logInOptions = {
            accountName: username,
            password: password
        }

        logfunc(JSON.stringify(logInOptions) + " is trying to log in");

        user.logOn(logInOptions);

        let steamid = "";
        let successflag = false;

        user.on('loggedOn', res => {
            logfunc("Logged into Steam as " + user.steamID.getSteam3RenderedID());

            steamid = user.steamID;

            user.setPersona(SteamUser.EPersonaState.Online);
            user.gamesPlayed(730);
        });

        csgo.on("connectedToGC", function () {
            logfunc("connectedToGC");

            //Check connection to game coordinator
            if (csgo.haveGCSession) {
                var account_id = new SteamID(steamid.toString());

                csgo.requestPlayersProfile(account_id, function (data) {
                    // logfunc("profile info" + JSON.stringify(data));
                    // successflag = true;
                    // user.logOff();
                    // myResolve(data);
                });

                csgo.on("playersProfile", function (data) {
                    logfunc("profile info" + JSON.stringify(data));
                    successflag = true;
                    user.logOff();

                    let profile = data;
                    //extract to correct info to ranking
                    let ranking = { rank_id: 0, wins: 0, rank_type_id: global_config.rank_type_id };

                    for (let ran of data.rankings) {
                        if (ran.rank_type_id && ran.rank_type_id == global_config.rank_type_id) {
                            ranking = ran;
                        }
                    }

                    if (data && data.ranking && data.ranking.rank_type_id && data.ranking.rank_type_id == global_config.rank_type_id) {
                        ranking = data.ranking;
                    }

                    profile.ranking = ranking;

                    myResolve(profile);
                });
            };

        });

        setTimeout(() => {
            if (!successflag) {
                logfunc("no connection to SteamServer");
                myResolve("no connection to SteamServer");
            }
        }, timeinterval * 3); // if no connection for 15s, determine not connected to server
    });

    let profile = await myPromise;
    return profile;
}

/*{
     my_current_event_teams: [],
     my_current_event_stages: [],
     rankings: [
       {
         account_id: 1191656732,
         rank_id: 0,
         wins: 0,
         rank_change: null,
         rank_type_id: 7
       }
     ],
     account_id: 1191656732,
     ongoingmatch: null,
     global_stats: null,
     penalty_seconds: null,
     penalty_reason: null,
     vac_banned: null,
     ranking: null,
     commendation: null,
     medals: null,
     my_current_event: null,
     my_current_team: null,
     survey_vote: null,
     activity: null,
     player_level: 2,
     player_cur_xp: 327680333,
     player_xp_bonus_flags: null
   }
*/

//filtering accounts whether they are useful
const filteringAndGrouping = async () => {
    try {
        let modes = ["openrank", "onlylose", "level"];

        for (let mode of modes) {
            //filtering process
            // logfunc(mode + " mode filtering is started")
            let accounts = await SteamLib.getAccountsForFlag(mode, "initial");

            // logfunc("avaialable accounts number " + accounts.length);
            //loop at least 5 accounts
            let count = 0;
            for (let account of accounts) {
                if (count < 5) {
                    if (process.env.NODE_ENV == 'test') {
                        await SteamLib.setStatusFlagAndDesc(account._id, "useful", "useful");
                    }
                    else {
                        //get profile using steam api
                        let profile = await getProfile(account.username, account.password);

                        //console.log(profile);
                        //error manipulation
                        if (typeof profile == "string") {
                            //now profile is error string
                            await SteamLib.setStatusFlagAndDesc(account._id, "notuseful", profile);
                        } else {
                            await SteamLib.setProfileBefore(account._id, profile);
                            await SteamLib.setProfileAfter(account._id, profile);

                            //filtering accounts with penalty and vac and level 1
                            if (profile.penalty_seconds != null) await SteamLib.setStatusFlagAndDesc(account._id, "notuseful", "penalty");
                            else if (profile.penalty_reason != null) await SteamLib.setStatusFlagAndDesc(account._id, "notuseful", "penalty");
                            else if (profile.vac_banned != null) await SteamLib.setStatusFlagAndDesc(account._id, "notuseful", "vac_banned");
                            else if (profile.player_level <= 1) await SteamLib.setStatusFlagAndDesc(account._id, "notuseful", "level 1 account");
                            else {
                                await SteamLib.setStatusFlagAndDesc(account._id, "useful", "useful");
                            }
                        }
                    }
                    count++;
                }
            }

            //grouping process - in this process initial accounts' flag are updated to grouped
            // logfunc(mode + " : grouping is started");
            await SteamLib.formGroup(mode);

            //update client's information according to matchmode
            // logfunc(mode + " : assigning is started");
            await SteamLib.assignGroupToClients(mode);

            //check grouped accounts that doesn't belong to any useful clients and 
            // logfunc(mode + " : defragment in grouped accounts is statared");
            await SteamLib.defragment(mode);
        }
    } catch (err) {
        // logfunction(err);
    }
}

setInterval(async () => {
    try {
        if (!timeflag) {
            timeflag = true;
            //filter accounts at least 10 in each match mode
            // logfunc("filtering is started");

            await filteringAndGrouping();

            timeflag = false;
        }
    } catch (err) {
        // logfunc(err)
    }
}, timeinterval);
