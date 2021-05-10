const Config = require('../models/config');

//set group type such as wingmand and competitive, future needs
const SetGroupType = async (gtype) => {
    try {
        let config = await Config.find({});
        await Config.findByIdAndUpdate(config[0]._id, { grouptype: gtype });
    }
    catch (err) {
        console.log(err);
        throw err;
    }
}

//get group type such as wingmand and competitive, future needs
const GetGroupType = async () => {
    try {
        let config = await Config.find({});
        let result;
        result = config[0].grouptype;
        return result;
    }
    catch (err) {
        console.log(err);
        throw err;
    }
}

//set mathmode's info such as map
const SetMatchMode = async (mode) => {
    try {
        let config = await Config.find({});
        await Config.findByIdAndUpdate(config[0]._id, { matchmode: mode });
    }
    catch (err) {
        console.log(err);
        throw err;
    }
}

//get matchmode's info
const GetMatchMode = async () => {
    try {
        let config = await Config.find({});
        let result;
        result = config[0].matchmode;
        return result;
    }
    catch (err) {
        console.log(err);
        throw err;
    }
}

//get all maps available
const getAllMaps = async () => {
    try {
        let config = await Config.find({});
        let maps = config[0].map || [];
        return maps
    } catch (err) {
        console.log(err);
        throw err;
    }
}

//get match info
const getMatchInfo = async (mode) => {
    try {
        let config = await Config.find({});
        let result = config[0]["matchmode"][mode] || {};
        return result;
    } catch (err) {
        console.log(err);
        throw err;
    }
}

//set match info
const setMatchInfo = async (mode, data) => {
    try {
        let config = await Config.find({});
        let temp = config[0].matchmode;
        temp[mode] = data;
        await Config.findByIdAndUpdate(config[0]._id, { matchmode: temp });
    } catch (err) {
        console.log(err);
        throw err;
    }
}

//set gamestarting flag true or false to indicate start and stop matchmodes
const setGamestartingFlag = async (mode, flag) => {
    try {
        let config = await Config.find({});
        let temp = config[0].gamestarting;
        temp[mode] = flag;

        await Config.findByIdAndUpdate(config[0]._id, {gamestarting: temp});
    } catch (err) {
        console.log(err);
        throw err;
    }
}

//get gamestarting flag
const getGamestartingFlag = async (mode) => {
    try {
        let config = await Config.find({});
        return config[0]["gamestarting"][mode];
    } catch (err) {
        console.log(err);
        throw err;
    }
}

//initial operation when server starts up
const InitialDB = async () => {
    try {
        //init config collection for having only 1 document
        let config = await Config.find({});

        //set config when first startup 
        if (config.length == 0) {
            let baseConfig = {
                map: ["mg_de_mirage", "mg_de_inferno", "mg_de_train", "mg_de_dust2", "mg_de_anubis", "mg_de_cache", "mg_de_ancient", "mg_de_engage", "mg_cs_apollo", "mg_cs_agency", "mg_cs_office"],
                matchmode: {
                    openrank: {
                        map: "mg_de_mirage",
                        condition: 0
                    },
                    onlylose: {
                        map: "mg_cs_office",
                        condition: 5
                    },
                    level: {
                        map: "mg_de_dust2",
                        condition: 12
                    }
                },
                filteringflag: false,
                grouptype: "competitive",
                gamestarting: { openrank: false, onlylose: false, level: false }
            }

            await Config.create(baseConfig);
        }
        else if (config.length >= 1) {
            //delete other documents and update flags for false
            let index = 0;
            for (const value of config) {
                if (index === 0)
                    await Config.findByIdAndUpdate(value._id, { filteringflag: false, gamestarting: { openrank: false, onlylose: false, level: false } });
                else
                    await Config.findByIdAndRemove(value._id);
                index++;
            }
        }
    }
    catch (err) {
        console.log(err);
        throw err;
    }
}



const ConfigLib = {
    SetGroupType,
    GetGroupType,
    InitialDB,
    SetMatchMode,
    GetMatchMode,
    getAllMaps,
    getMatchInfo,
    setMatchInfo,
    setGamestartingFlag,
    getGamestartingFlag
}

module.exports = ConfigLib;