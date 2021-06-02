const GlobalLib = require('./globallib');

const GroupLib = require('./grouplib');

const AccountLib = require('./accountlib');

const ClientLib = require('./clientlib');

const ConfigLib = require('./configlib');

const MatchTicketLib = require('./matchticketlib');

const MatchLib = require('./matchlib');

/* config */
let global_config = {}
let timeconfig = {} //config delay time
if (process.env.NODE_ENV == 'test') {
    global_config = {
        accounts: 2, //5:Matchmaking, 2: Wingman
        rank_type_id: 7, //6: Matchmaking, 7: Wingman, 10: Danger Zone
        winscore: 8 //8:wingman, 16:Matchmaking
    }
    timeconfig = {
        beforeInvited: 300000,
        beforeMatchid: 1800000,
        beforeMatchStart: 300000,
        duringAccept: 300000,
        duringSameMatchID: 3000,
        beforeMatching: 300000,
        duringMatch: 2400000,
        beforeUpload: 300000
    };
}
else if (process.env.NODE_ENV == 'wingman') {
    global_config = {
        accounts: 2, //5:Matchmaking, 2: Wingman
        rank_type_id: 7, //6: Matchmaking, 7: Wingman, 10: Danger Zone
        winscore: 8 //8:wingman, 16:Matchmaking
    }
    timeconfig = {
        beforeInvited: 240000,
        beforeMatchid: 1800000,
        beforeMatchStart: 240000,
        duringAccept: 90000,
        duringSameMatchID: 3000,
        duringMatch: 2400000,
        beforeMatching: 300000,
        beforeUpload: 60000
    };
}
else if (process.env.NODE_ENV == "competitive") {
    global_config = {
        accounts: 5, //5:Matchmaking, 2: Wingman
        rank_type_id: 6, //6: Matchmaking, 7: Wingman, 10: Danger Zone
        winscore: 15 //8:wingman, 16:Matchmaking
    }
    timeconfig = {
        beforeInvited: 240000,
        beforeMatchid: 1800000,
        beforeMatchStart: 240000,
        duringAccept: 90000,
        duringSameMatchID: 3000,
        duringMatch: 2400000,
        beforeMatching: 300000,
        beforeUpload: 60000
    };
}


//variable database
let aliveGroups = {};// groupid: statusflag

let matchids = {    // matchid: matchid, vbclient: websocket
    openrank: {},
    onlylose: {},
    level: {}
};


//initialize db whever server is startup
const initial = async () => {
    //clear account's statusflag to initial from grouped, useful
    await AccountLib.clearStatusFlagDesc();

    //clear client's useful flag to flase
    await ClientLib.clearClient();

    //delete group db
    await GroupLib.clearGroupFlag();

    //delete match db
    //await MatchLib.deleteMatchDB();

    //set config db
    await ConfigLib.InitialDB();

    console.log("Initialize is complete");
}

//for dashboard info will be send by socket
const getBrowserRealtimeInfo = async (mode) => {
    try {
        let result = {};
        result.accounts = await AccountLib.getStatisticInfo(mode) || {};
        result.clients = await ClientLib.getAllClients(mode) || {}; // must add client res info here
        // result.matches = await MatchTicketLib.getPlayingMatchInfo(mode) || {};

        return result;
    } catch (err) {
        console.log(err);
    }

};

//get match states
const getAllMatches = async (mode) => {
    try {
        GlobalLib.verifyMatchMode(mode);

        //number of accounts
        const accounts = await AccountLib.getNumberOfAccountsUseful(mode);

        //number of clients
        const clients = await ClientLib.getNumberOfClients(mode);

        //maps
        const maps = await ConfigLib.getAllMaps();

        //match information form config db
        const matchInfo = await ConfigLib.getMatchInfo(mode);

        return { accounts, clients, maps, matchInfo };

    } catch (err) {
        console.log(err);
        throw err;
    }
}

//get account for status flag such as "initial", "processed"
const getAccountsForFlag = async (mode, flag) => {
    try {
        return await AccountLib.getAccountsForFlag(mode, flag);
    } catch (err) {
        console.log(err);
    }
}

//set status flag and description of account
const setStatusFlagAndDesc = async (accountid, flag, desc) => {
    try {
        await AccountLib.setStatusFlagAndDesc(accountid, flag, desc);
    } catch (err) {
        console.log(err);
    }
}

//profile_before:{MAP}
const setProfileBefore = async (id, profile) => {
    try {
        await AccountLib.setProfileBefore(id, profile);
    } catch (err) {
        console.log(err);
    }
}

//profile_after:{MAP}
const setProfileAfter = async (id, profile) => {
    try {
        await AccountLib.setProfileAfter(id, profile);
    } catch (err) {
        console.log(err);
    }
}

//form group accounts with flag is useful 
const formGroup = async (mode) => {
    try {
        let accounts = await AccountLib.getAccountsForFlag(mode, "useful");

        let nAccInGroup = global_config.accounts;    //for wingman and competitive, 2 or 5

        //number of groups can be made
        let loop = Math.floor(accounts.length / nAccInGroup);
        for (let i = 0; i < loop; i++) {
            let accountids = [];
            let teamleaderid = 0;
            let matchmode = mode;
            let useful = true;
            for (let j = 0; j < nAccInGroup; j++) {
                // console.log(accounts[i * nAccInGroup + j]);
                accountids.push(accounts[i * nAccInGroup + j]._id);
            }
            teamleaderid = accountids[0];
            // console.log(accountids);
            //create group
            await GroupLib.createGroup({ matchmode: matchmode, teamleaderid: teamleaderid, accountids: accountids, useful: useful });

            //update account's status flag to grouped
            for (const accountid of accountids) {
                await AccountLib.setStatusFlagAndDesc(accountid, "grouped", "grouped");
            }
        }

    } catch (err) {
        console.log(err);
        throw err;
    }
}

//set all acounts' status flag and description in one group
const setAccountsFlagDescInGroup = async (groupid, flag, desc) => {
    try {
        let group = await GroupLib.findById(groupid);

        for (const accountid of group.accountids) {
            await AccountLib.setStatusFlagAndDesc(accountid, flag, desc);
        }

    } catch (err) {
        console.log(err);
        throw err;
    }
}

//get all accounts in one group
const getAllAccountsInGroup = async (groupid) => {
    try {
        let group = await GroupLib.findById(groupid);
        let accounts = [];
        for (let accountid of group.accountids) {
            accounts.push(await AccountLib.getAccountByID(accountid));
        }
        return accounts;
    } catch (err) {
        console.log(err);
        throw err;
    }
}

//check if all accounts in one group's status flag are grouped
const isAllAccountsInGroupAreAvailable = async (groupid) => {
    try {
        let group = await GroupLib.findById(groupid);

        for (let accountid of group.accountids) {
            //console.log("checking account " + accountid);
            let flag = await AccountLib.isOneAccountAvailable(accountid);   //"grouped" "processed" "no"
            //console.log("checking flag " + flag);

            switch (flag) {
                case "grouped":
                    return true;
                case "processed":
                    return false;
                case "no":  //change account's status
                    throw "group information is incorrect";
            }
        }

        return true;
    } catch (err) {
        //set group's useful flag to false
        await GroupLib.setGroupFlag(groupid, false);

        //set accounts flag in this group to "notprocessed"
        console.log(groupid + "group info is changed while processing");
        await setAccountsFlagDescInGroup(groupid, "notprocessed", "group info is changed while processing");

        //delete ticket that has this groupid
        //let oppositeid = await MatchTicketLib.deleteTicketByGroupid(groupid);
        //if (oppositeid != null) {
        //    console.log(groupid + "opponent group is closed while matching");
        //    await setAccountsFlagDescInGroup(oppositeid, "notprocessed", "opponent group is closed while matching");
        //}

        console.log(err);
        return false;
    }
}


//get one avaliable group from already groups
const getOneAvailableGroup = async (mode) => {
    try {
        //useful flag is refer to available and able to assign
        let groups = await GroupLib.find({ matchmode: mode, useful: true }) || [];

        for (const group of groups) {
            // console.log("checking this group" + group);
            //check account ids if there is error
            if (await isAllAccountsInGroupAreAvailable(group._id)) {
                //console.log("assigned is complete");
                //assigned
                await GroupLib.setGroupFlag(group._id, false);
                return group._id;
            }
        }

        //there is no available group
        return null;
    } catch (err) {
        console.log(err);
        throw err;
    }
}

//assign maded groups to client
const assignGroupToClients = async (mode) => {
    try {
        let clients = await ClientLib.find({ matchmode: mode, useful: true }) || [];

        for (const client of clients) {
            let i;
            //check already assigned group to clients
            let newGroupIds = [];
            for (i = 0; i < client.groupids.length && i < client.capacity; i++) {
                //console.log("checking original group");
                if (await isAllAccountsInGroupAreAvailable(client.groupids[i]))
                    newGroupIds.push(client.groupids[i]);
            }
            client.groupids = newGroupIds;

            //don't assign to already assigned group
            for (i = client.groupids.length; i < client.capacity; i++) {
                //console.log("group sequence is " + i);
                let groupid = await getOneAvailableGroup(mode);
                if (groupid == null) continue;

                //console.log("available group id" + groupid);

                client.groupids.push(groupid);
            }

            //update client db
            await ClientLib.findByIdAndUpdate(client._id, { groupids: client.groupids });
        }
        // console.log("assigning is finished");
    } catch (err) {
        console.log(err);
    }
}

// check if this account is in online client
const isAccountInOnlineClient = async (accountid) => {
    try {
        let clients = await ClientLib.find({ useful: true });

        for (let client of clients) {
            for (let groupid of client.groupids) {
                let group = await GroupLib.findById(groupid);

                if (group.accountids.indexOf(accountid) != -1)
                    return true;
            }
        }

        return false;
    } catch (err) {
        console.log(err);
    }
}

//check if this account is in useful group
const isAccountInUsefulGroup = async (accountid) => {
    try {
        let groups = await GroupLib.find({ useful: true });

        for (let group of groups) {
            if (group.accountids.indexOf(accountid) != -1)
                return true;
        }

        return false;
    } catch (err) {
        console.log(err);
    }
}

//this is important. like memory defragment. process all redundant accounts
const defragment = async (mode) => {
    try {
        //find grouped accounts
        let accounts = await AccountLib.getAccountsForFlag(mode, "grouped");

        for (let account of accounts) {
            //check if each account is in avalaible group. this means that this group is not assigned to any clients
            if (await isAccountInUsefulGroup(account._id)) continue;


            //check if each account are belong to online clients
            if (! await isAccountInOnlineClient(account._id)) {
                await AccountLib.setStatusFlagAndDesc(account._id, "notprocessed", "client info is changed");
            }
        }

    } catch (err) {
        console.log(err);
    }
}

//get info to send to vbclient
/*
    {
        action: "info"
        map: ""
        client: {
            ...clientSchema
        ]
        groups: [
            {
                id: groupid,
                teamleader: {accountSchema},
                accounts:[accountSchema]
            }
        };

    }

*/

const getInfoForVbclient = async (ipv4) => {
    try {
        let infomessage = {};
        infomessage.action = "info";
        let tempclient = await ClientLib.find({ clientip: ipv4 });
        infomessage.client = tempclient[0];
        infomessage.groups = [];
        let matchinfo = await ConfigLib.getMatchInfo(tempclient[0].matchmode);
        infomessage.map = matchinfo.map;
        
        //console.log(infomessage.map);

        //check gamestarting flag
        let gameStartedFlag = await MatchLib.getGamestartingFlag(infomessage.client.matchmode);
        if (gameStartedFlag) {
            for (let groupid of infomessage.client.groupids) {
                let group = {};
                group.id = groupid;
                group.teamleader = {};
                group.accounts = [];

                let onegroup = await GroupLib.findById(groupid);
                group.teamleader = await AccountLib.getAccountByID(onegroup.teamleaderid);

                for (accountid of onegroup.accountids) {
                    let account = await AccountLib.getAccountByID(accountid);
                    group.accounts.push(account);
                }

                infomessage.groups.push(group);
            }
        }
        return infomessage;
    } catch (err) {
        console.log(err);
    }
}

/* matchmanage */
/*
"csgo_started", groupid, serverip
"invite", groupid
"invited", groupid
"search", groupid
"matchid", groupid, matchid
"confirm_match", groupid
"match_started", groupid
"match_finished", groupid, accountsinfo
*/

//check if this account is ranked compare to original status
function isRanked(accounts) {

    for (let account of accounts) {
        if (account.profile_after && account.profile_before) {
            if (account.profile_after.ranking && account.profile_before.ranking) {
                let before_rankid = account.profile_before.ranking.rank_id || 0;
                let after_rankid = account.profile_after.ranking.rank_id || 0;
                console.log("before_rankid" + before_rankid);
                console.log("after_rankid" + after_rankid);
                if (after_rankid - before_rankid < 1)
                    return false;

            } else return false;
        }
        else return false;
    }

    return true;
}

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
//true: condition is fullfilled in open rank mode
const check_open_rank = async (groupid) => {
    try {
        let faccounts = await getAllAccountsInGroup(groupid);

        let flag = false;
        if (await isRanked(faccounts)) {
            console.log(groupid + " is ranked")
            flag = true;
            await setAccountsFlagDescInGroup(groupid, "processed", "ranked");
        }
        else
            console.log(groupid + " is still not ranked");

        return flag;
    } catch (err) {
        console.log(err);
        throw err;
    }
}

let loseDB = {}; // groupid: losenumber

//true: condition is fullfilled in only lose mode
const check_only_lose = async (mode, groupid) => {
    try {
        let condition = await ConfigLib.getMatchInfo(mode);
        let faccounts = await getAllAccountsInGroup(groupid);
        
        console.log("lose condition is " + condition.condition);

        loseDB[groupid] = loseDB[groupid] || 0;

        //if (await MatchTicketLib.isGroupidLose(mode, groupid)) loseDB[groupid]++;
        loseDB[groupid]++;

        let flag = false;

        if (loseDB[groupid] == condition.condition || await isLosed(faccounts, condition.condition)) {
            flag = true;
            console.log(groupid + " is losed for all lose conditions")
            delete loseDB[groupid];
            await setAccountsFlagDescInGroup(groupid, "processed", "losed");
        }
        else
            console.log("this group losed for " + loseDB[groupid] + " times");

        return flag;
    } catch (err) {
        console.log(err);
        throw err;
    }
}

//true: condition is fullfilled in level mode
let levelDB = {}; // groupid: number of mathes
const check_level = async (mode, groupid) => {
    try {
        let condition = await ConfigLib.getMatchInfo(mode);
        let faccounts = await getAllAccountsInGroup(groupid);

        console.log("level condition is " + condition.condition);
        
        levelDB[groupid] = levelDB[groupid] || 0;
        levelDB[groupid]++;
        let flag = false;

        if (levelDB[groupid] == condition.condition || await isLeveled(faccounts, condition.condition)) {
            flag = true;
            delete levelDB[groupid];
            console.log(groupid + " is leveled for all level conditions")
            await setAccountsFlagDescInGroup(groupid, "processed", "leveled");
        }
        else
            console.log(groupid + " is leveled for " + levelDB[groupid] + " times");

        return flag;
    } catch (err) {
        console.log(err);
        throw err;
    }
}

//check group's account fulfilles mathcmode's condition and update accounts' status flag
const checkConditionAndUpdate = async (matchmode, fgroupid) => {
    try {
        let result;
        switch (matchmode) {
            case "openrank":
                result = await check_open_rank(fgroupid);
                break;
            case "onlylose":
                result = await check_only_lose(matchmode, fgroupid);
                break;
            case "level":
                result = await check_level(matchmode, fgroupid);
                break;
        }

        return result;
    } catch (err) {
        console.log(err);
        throw err;
    }
}

//send socket message to vbclient with action
const sendMessage = async (action, data, vbclient, accountFlag, desc, waitTime) => {
    try {
        let message = {};
        message.action = action;

        for (let key in data) {
            message[key] = data[key];
        }
        console.log(message);

        vbclient.send(JSON.stringify(message));
        console.log("sendmessage");
        console.log(action + " : " + data.groupid);

        let timestamp = Date.now();
        aliveGroups[data.groupid] = timestamp;

        if (waitTime != 0) {
            //waiting for replay of invite
            setTimeout(async () => {
                if (aliveGroups[data.groupid] == timestamp) {
                    console.log("timeout:" + desc);
                    console.log(data.groupid + " : " + desc);
                    await SteamLib.setAccountsFlagDescInGroup(data.groupid, accountFlag, desc);
                    delete aliveGroups[data.groupid];
                }
            }, waitTime);
        }
    } catch (err) {
        console.log(err);
    }
}

//process client's message
const matchManage = async (json, vbclient) => {
    try {
        console.log("received message:" + JSON.stringify(json));
        switch (json.action) {
            case "csgo_started":
                await sendMessage("invite", { groupid: json.groupid }, vbclient, "notprocessed", "error occured in search match", timeconfig.beforeInvited);
                break;

            case "invited":
                await sendMessage("search", { groupid: json.groupid }, vbclient, "notprocessed", "error occured in search match", timeconfig.beforeMatchid);
                break;

            case "matchid":
                {
                    let mode = await GroupLib.getMatchMode(json.groupid);
                    let pushFlag = true;

                    matchids[mode][json.groupid] = matchids[mode][json.groupid] || {};
                    matchids[mode][json.groupid]["vbclient"] = vbclient;

                    for (let groupid in matchids[mode]) {
                        //compare if two different groups' matchid is equal
                        if (matchids[mode][groupid]["matchid"] == json.matchid && groupid != json.groupid) {
                            pushFlag = false;
                            let firstgroupid = groupid;
                            let secondgroupid = json.groupid;

                            if (mode == "onlylose") {
                                let timestamp = Date.now();
                                aliveGroups[firstgroupid] = timestamp;

                                //waiting for accepttime, if not accept delete pushed matchid send search message again
                                setTimeout(async () => {
                                    console.log(json.matchid + " is deleted ");
                                    await sendMessage("search", { groupid: firstgroupid }, matchids[mode][firstgroupid]["vbclient"], "notprocessed", "error occured in research match", timeconfig.beforeMatchid);
                                    await sendMessage("search", { groupid: secondgroupid }, matchids[mode][secondgroupid]["vbclient"], "notprocessed", "error occured in research match", timeconfig.beforeMatchid);
                                }, timeconfig.duringAccept);

                            } else {
                                console.log("....match is same....");
                                //send to confirm_match                        
                                await sendMessage("confirm_match", { groupid: firstgroupid }, matchids[mode][firstgroupid]["vbclient"], "notprocessed", "error occured in confirm", timeconfig.beforeMatchStart);
                                await sendMessage("confirm_match", { groupid: secondgroupid }, matchids[mode][secondgroupid]["vbclient"], "notprocessed", "error occured in confirm", timeconfig.beforeMatchStart);

                                //save to matchticket 
                                let scores = await MatchLib.generateScore(mode, global_config.winscore); // scores:{fscore:number, sscore:number}
                                console.log("scores:" + JSON.stringify(scores));

                                await MatchTicketLib.createMatchTicket(mode, firstgroupid, secondgroupid, scores.fscore, scores.sscore, "initial");
                                //delete matchids[mode][secondgroup]["matchid"]; this is not added, just used for compare
                            }
                            delete matchids[mode][firstgroupid]["matchid"];
                        }
                    }

                    if (pushFlag) {
                        let timestamp = Date.now();
                        console.log(json.matchid + " is added ");
                        aliveGroups[json.groupid] = timestamp;

                        matchids[mode][json.groupid]["matchid"] = json.matchid;

                        if (mode == "onlylose") {
                            //they have to play with real players
                            setTimeout(async () => {
                                if (aliveGroups[json.groupid] == timestamp) {
                                    console.log("....only lose match....");
                                    //send to confirm_match
                                    await sendMessage("confirm_match", { groupid: json.groupid }, matchids[mode][json.groupid]["vbclient"], "notprocessed", "error occured in confirm", timeconfig.beforeMatchStart);

                                    //save to matchticket 
                                    let scores = await MatchLib.generateScore(mode, global_config.winscore); // scores:{fscore:number, sscore:number}
                                    console.log("scores:" + JSON.stringify(scores));

                                    await MatchTicketLib.createMatchTicket(mode, json.groupid, json.groupid, scores.fscore, scores.sscore, "initial");
                                    delete matchids[mode][json.groupid]["matchid"];
                                }
                            }, timeconfig.duringSameMatchID);
                        }
                        else {
                            //waiting for accepttime, if not accept delete pushed matchid send search message again
                            setTimeout(async () => {
                                if (aliveGroups[json.groupid] == timestamp) {
                                    console.log(json.matchid + " is deleted ");
                                    delete matchids[mode][json.groupid]["matchid"];
                                    await sendMessage("search", { groupid: json.groupid }, vbclient, "notprocessed", "error occured in research match", timeconfig.beforeMatchid);
                                }
                            }, timeconfig.duringAccept);
                        }
                    }
                }
                break;
            case "match_started":
                {
                    let mode = await GroupLib.getMatchMode(json.groupid);

                    let result = await MatchTicketLib.getMatchScoreByGroupid(mode, json.groupid);

                    await sendMessage("match_score", { groupid: json.groupid, matchscore: result.matchscore, match_priority: result.match_priority }, vbclient, "notprocessed", "error occured in match_score receive", timeconfig.beforeMatching);
                }
                break;
            case "matching":
                {
                    let mode = await GroupLib.getMatchMode(json.groupid);

                    let timestamp = Date.now();
                    aliveGroups[json.groupid] = timestamp;

                    await MatchTicketLib.updateTicketFlag(mode, json.groupid, "processing");

                    //for time count, do nothing on client just count time
                    await sendMessage("timecount", { groupid: json.groupid }, vbclient, "notprocessed", "error occured in match", timeconfig.duringMatch);
                }
                break;

            case "first_clicker_done":
                {
                    let opponentId = await MatchTicketLib.getOpponentGroupId(json.groupid);

                    let mode = await GroupLib.getMatchMode(json.groupid);

                    await sendMessage("clicker_second", { groupid: opponentId }, matchids[mode][opponentId]["vbclient"], "notprocessed", "error occured in match", timeconfig.duringMatch);
                }
                break;
            //from second_clicker or endgame
            case "match_finished":
                {
                    //send upload_info to two clients
                    let opponentId = await MatchTicketLib.getOpponentGroupId(json.groupid);

                    let mode = await GroupLib.getMatchMode(json.groupid);
                    console.log("oppoeneId is " + opponentId);

                    if (opponentId != null) {
                        if (mode == "onlylose") {
                            await sendMessage("upload_info", { groupid: json.groupid }, vbclient, "notprocessed", "error occured in upload account's info", timeconfig.beforeUpload);
                        }
                        else {
                            await sendMessage("upload_info", { groupid: opponentId }, matchids[mode][opponentId]["vbclient"], "notprocessed", "error occured in upload account's info", timeconfig.beforeUpload);

                            await sendMessage("upload_info", { groupid: json.groupid }, vbclient, "notprocessed", "error occured in upload account's info", timeconfig.beforeUpload);
                        }
                    }
                    else {
                        let err;
                        err.groupid = json.groupid;
                        err.desc = "oppenent group is already deleted";
                        throw err;
                    }
                }
                break;
            //get all account's info
            case "uploading":
                //update accounts profile_after

                // check condition
                // true means this group must be finished, false means match again
                // all false means accept match
                {
                    let mode = await GroupLib.getMatchMode(json.groupid);
                    let timestamp = Date.now();
                    aliveGroups[json.groupid] = timestamp;

                    //update profile of accounts
                    for (let account of json.accounts) {
                        let profile = await AccountLib.getProfileAfter(account._id);
                        profile["ranking"] = profile["ranking"] || {};
                        profile.ranking.rank_id = profile.ranking.rank_id || 0;
                        profile.ranking.wins = profile.ranking.wins || 0;
                        let flag = await MatchTicketLib.isGroupidLose(mode, json.groupid);

                        //console.log("This group " + json.groupid + " lose flag is " + flag);

                        if (flag == false) {
                            if ((profile.ranking.wins % 10) == 9)
                                profile.ranking.rank_id = profile.ranking.rank_id + 1;
                            
                            console.log("before wins = " + profile.ranking.wins);
                            profile.ranking.wins = profile.ranking.wins + 1;
                            console.log("now wins = " + profile.ranking.wins);
                        }

                        if( account.xppts != 0)
                            profile.player_cur_xp = account.xppts;
                        
                        if( account.level != 0)
                            profile.player_level = account.level;

                        switch (mode) {
                            case "openrank":
                                break;
                            case "onlylose":
                                profile.losed++;
                                break;
                            case "level":
                                profile.leveled++;
                                break;
                        }
                        //console.log(profile);

                        await AccountLib.setProfileAfter(account._id, profile);
                    }

                    //if condition is fulfilled all accounts' state is processed
                    let flag = await checkConditionAndUpdate(mode, json.groupid);

                    // delete matchids[mode][json.groupid];
                    MatchTicketLib.updateTicketFlag(mode, json.groupid, "processed");
                    //let oppositeid = await MatchTicketLib.deleteTicketByGroupid(json.groupid);

                    if (!flag) {
                        await sendMessage("invite", { groupid: json.groupid }, vbclient, "notprocessed", "error occured in invite", timeconfig.beforeInvited);
                    }
                }
                break;

            case "notconnected":
                {
                    let mode = await GroupLib.getMatchMode(json.groupid);
                    await setAccountsFlagDescInGroup(json.groupid, "notprocessed", "connection is failed to csgo server");
                }
                break;
        }
    } catch (err) {
        if (err.groupid != undefined && err.desc != undefined) {
            await SteamLib.setAccountsFlagDescInGroup(err.groupid, "notprocessed", err.desc);
        }

        console.log(err);
    }
}

//format all alive settings
const StopMatch = async (mode) => {
    try {
        //get online clients
        let clients = await ClientLib.find({ useful: true });

        //iterate client and get groups and get accounts and set "notprocessed"
        for (let client of clients) {
            for (let groupid of client.groupids) {
                let group = await GroupLib.findById(groupid);

                for (let account of group.accountids) {
                    await AccountLib.setStatusFlagAndDesc(account._id, "notprocessed", "match is stopped manually while processing")
                }
            }
        }
    } catch (err) {
        console.log(err);
    }
}

const getProfileAfter = async (id) => {
    try{
        let profile = await AccountLib.getProfileAfter(id);
        return  profile;
    } catch (err) {
        console.log
    }
}

const getProfileBefore = async (id) => {
    try{
        let profile = await AccountLib.getProfileBefore(id);
        return  profile;
    } catch (err) {
        console.log
    }
}

const SteamLib = {
    getAccountsForFlag,
    setStatusFlagAndDesc,
    formGroup,
    assignGroupToClients,
    defragment,
    isAccountInOnlineClient,
    isAccountInUsefulGroup,
    isAllAccountsInGroupAreAvailable,
    initial,
    getBrowserRealtimeInfo,
    getAllMatches,
    getInfoForVbclient,
    setAccountsFlagDescInGroup,
    setProfileBefore,
    matchManage,
    setProfileAfter,
    StopMatch,
    getProfileAfter,
    getProfileBefore,
    getAllAccountsInGroup
}

module.exports = SteamLib;