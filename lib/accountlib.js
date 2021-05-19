const Accounts = require('../models/accounts');

const GlobalLib = require('./globallib');

const ConfigLib = require('./configlib');

//check if this name is already in database and throw exception
const verifyNameforDuplicate = async (username, id) => {

    username = username || "";
    if (username.length == 0)
        throw "username must be specified";

    //if id is specified, this is called from update
    if (id || 0) {
        const account = await Accounts.findById(id);
        if (account.username == username)    //case for updating password in same username 
            return;
    }

    let result = await find({ username: username });
    if (result.length >= 1) {
        throw username + " is alreay inserted";
    }
}

//check if this name is already in database and return flag
const isNameValidate = async (username) => {

    username = username || "";
    if (username.length == 0)
        return false;

    let result = await find({ username: username });
    if (result.length >= 1) {
        return false;
    }
    return true;
}


//====================================================//
//mongoose manage findbyid
const getAccountByID = async (id) => {
    try {
        GlobalLib.verifyID(id);
        let account = await Accounts.findById(id) || {};
        return account;
    } catch (err) {
        console.log(err);
        throw err;
    }
}

//mongoose manage find
const find = async (data) => {
    try {
        const accounts = Accounts.find(data);
        return accounts;
    } catch (err) {
        console.log(err);
        throw err;
    }
}

// this account's status flag expects to be grouped or processed
const isOneAccountAvailable = async (accountid) => {
    try {
        const result = await Accounts.findById(accountid) || null;
        if (result == null)
            return "no";

        // check if this account is not changed
        switch (result.status.flag) {
            case "grouped":
                return "grouped";
            case "processed":
                return "processed";
        }

        return "no";

    } catch (err) {
        console.log(err);
        throw err;
    }
}

//this is for user's browser action
const updateById = async (id, data) => {
    try {
        GlobalLib.verifyID(id);
        await verifyNameforDuplicate(data.username, id);

        const accounts = await Accounts.findByIdAndUpdate(id, data) || {};
        return accounts;
    } catch (err) {
        console.log(err);
        throw err;
    }
}

//set statuf flag and description of account id
const setStatusFlagAndDesc = async (id, flag, desc) => {
    try {
        GlobalLib.verifyID(id);
        desc = desc || "";

        await Accounts.findByIdAndUpdate(id, { status: { flag: flag }, des: desc });
    } catch (err) {
        console.log(err);
        throw err;
    }
}

//set profile_before
const setProfileBefore = async (id, profile) => {
    try {
        GlobalLib.verifyID(id);
        profile = profile || {};
        //check if profile_before is already exists
        let prevProfile = await getProfileBefore(id);

        if(Object.keys(prevProfile).length === 0)
        {
            await Accounts.findByIdAndUpdate(id, { profile_before: profile });
        }
        else 
        
    } catch (err) {
        console.log(err);
        throw err;
    }
}

//set profile_after
const setProfileAfter = async (id, profile) => {
    try {
        GlobalLib.verifyID(id);
        profile = profile || {};
        
        await Accounts.findByIdAndUpdate(id, { profile_after: profile });
    } catch (err) {
        console.log(err);
        throw err;
    }
}

//get profile_after
const getProfileAfter = async (id) => {
    try {
        GlobalLib.verifyID(id);
        let account = await Accounts.findById(id)
        let profile = account.profile_after || {};
        return profile;
    } catch (err) {
        console.log(err);
        throw err;
    }
}
//get profile_after
const getProfileBefore = async (id) => {
    try {
        GlobalLib.verifyID(id);
        let account = await Accounts.findById(id)
        let profile = account.profile_before || {};
        return profile;
    } catch (err) {
        console.log(err);
        throw err;
    }
}

//mongoose operation - findbyidandremove
const removeById = async (id) => {
    try {
        GlobalLib.verifyID(id);
        await Accounts.findByIdAndRemove(id);
    } catch (err) {
        console.log(err);
        throw err;
    }
}

//impprt accounts from text file
const importAccount = async (data) => {
    try {
        GlobalLib.verifyMatchMode(data.matchmode);
        for (let account of data.data) {
            //check if this accounts is already in db        
            let flag = await isNameValidate(account[0]);
            if (flag) {
                let result = await Accounts.create({ matchmode: data.matchmode, status: { flag: "initial" }, username: account[0], password: account[1] });
            }
        }

    } catch (err) {
        console.log(err);
        throw err;
    }
}

//delete selected ids
const deleteSomeAccounts = async (data) => {
    try {
        for (let id of data.data) {
            //check if this accounts is already in db
            await removeById(id);
        }
    } catch (err) {
        console.log(err);
        throw err;
    }
}

//create new account
const createAccount = async (data) => {
    try {
        //check if this accounts is already in db
        await verifyNameforDuplicate(data.username);

        GlobalLib.verifyMatchMode(data.matchmode);

        const accounts = await Accounts.create({ matchmode: data.matchmode, status: { flag: "initial" }, username: data.username, password: data.password });
        return accounts;
    } catch (err) {
        console.log(err);
        throw err;
    }
}


//get all accounts according to matchmode
const getAllAccounts = async (mode) => {
    try {
        GlobalLib.verifyMatchMode(mode);

        const accounts = await find({ matchmode: mode });
        return accounts;
    } catch (err) {
        console.log(err);
        throw err;
    }
}

//get accounts according to status flag
const getAccountsForFlag = async (mode, flag) => {
    try {
        GlobalLib.verifyMatchMode(mode);

        const accounts = await find({ matchmode: mode, status: { flag: flag } });
        return accounts;
    } catch (err) {
        console.log(err);
        throw err;

    }
}

//get number of accounts that status flag is "initial" and "useful" and "grouped"
const getNumberOfAccountsUseful = async (mode) => {
    try {
        GlobalLib.verifyMatchMode(mode);
        const accounts = await find({ matchmode: mode });
        //count accounts status flag same as "initial" "useful" "grouped"
        let number = 0;
        for (let account of accounts) {
            switch (account.status.flag) {
                case "initial":
                    number++;
                    break;
                case "useful":
                    number++;
                    break;
                case "grouped":
                    number++;
                    break;
            }
        }
        return number;
    } catch (err) {
        console.log(err);
        throw err;
    }
}

//get info to send dashboard
const getStatisticInfo = async (mode) => {
    try {
        let statistic = {};
        GlobalLib.verifyMatchMode(mode);

        const accounts = await find({ matchmode: mode });
        //number of "not useful"
        statistic.notuseful = 0;

        //number of "useful" + "inital"
        statistic.useful = 0;

        //number of "processed"
        statistic.processed = 0;

        //number of "notprocessed"
        statistic.notprocessed = 0;

        for (let account of accounts) {
            switch (account.status.flag) {
                case "initial":
                    statistic.useful++;
                    break;
                case "grouped":
                    statistic.useful++;
                    break;
                case "useful":
                    statistic.useful++;
                    break;
                case "notuseful":
                    statistic.notuseful++;
                    break;
                case "processed":
                    statistic.processed++;
                    break;
                case "notprocessed":
                    statistic.notprocessed++;
                    break;
            }
        }

        return statistic;
    } catch (err) {
        console.log(err);
        throw err;
    }
}

//clear status and desc for all accounts which status flag are useful and grouped
const clearStatusFlagDesc = async () => {
    try {
        let accounts = await find({});
        for (let value of accounts) {
            switch (value.status.flag) {
                case "useful":
                    break;
                case "grouped":
                    break;
                default:
                    continue;
            }
            await Accounts.findByIdAndUpdate(value._id, { status: { flag: "initial" }, des: "" });
        }
    } catch (err) {
        console.log(err);
        throw err;
    }
}


const AccountLib = {
    getAccountByID,
    clearStatusFlagDesc,
    getAllAccounts,
    createAccount,
    removeById,
    find,
    updateById,
    setStatusFlagAndDesc,
    setProfileBefore,
    getNumberOfAccountsUseful,
    getStatisticInfo,
    getAccountsForFlag,
    isOneAccountAvailable,
    importAccount,
    deleteSomeAccounts,
    setProfileAfter,
    getProfileAfter,
    getProfileBefore
}

module.exports = AccountLib;