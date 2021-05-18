const GroupLib = require('./grouplib');

const ConfigLib = require('./configlib');
const GlobalLib = require('./globallib');

//set match info
const updateById = async (mode, data) => {
    try {
        GlobalLib.verifyMatchMode(mode);

        const match = await ConfigLib.setMatchInfo(mode, data) || {};
        return match;
    } catch (err) {
        console.log(err);
        throw err;
    }
}

//set gamestarting flag
const setGamestartingFlag = async (mode, data) => {
    try {
        GlobalLib.verifyMatchMode(mode);

        await ConfigLib.setGamestartingFlag(mode, data) || {};
    } catch (err) {
        console.log(err);
        throw err;
    }
}

//get gamestarting flag
const getGamestartingFlag = async (mode) => {
    try {
        GlobalLib.verifyMatchMode(mode);

        const match = await ConfigLib.getGamestartingFlag(mode) || false;
        return match;
    } catch (err) {
        console.log(err);
        throw err;
    }
}

//genrate random score
const generateScore = async (matchmode, winscore) => {
    try {
        let scores = {};
        switch (matchmode) {
            case "openrank":
                scores = await open_rank(winscore);
                break;
            case "onlylose":
                scores = await only_lose(winscore); // same as open_rank
                break;
            case "level":
                scores = await level(winscore);
                break;
        }
        return scores;
    } catch (err) {
        console.log(err);
        throw err;
    }
}

// generate openrank and onlylose score
const open_rank = async (winscore) => {
    try {
        let scores = {};
        randScore = Math.floor((Math.random() * winscore / 4));

        if (Math.floor((Math.random() * 2))) {
            scores.fscore = Math.floor(winscore/2)+1; //competitive: 8
            //scores.sscore = randScore;
            scores.sscore = 0;
        }
        else {
            //scores.fscore = randScore;   // minimum is winscore/2
            scores.fscore = 0;
            scores.sscore = Math.floor(winscore/2)+1; //competitive: 8
        }

        return scores;
    } catch (err) {
        console.log(err);
        throw err;
    }
}

// generate openrank and onlylose score
const only_lose = async (winscore) => {
    try {
        let scores = {};

        scores.fscore = Math.floor(winscore/2)+1; //competitive: 8
        scores.sscore = Math.floor(winscore/2)+1; //competitive: 8

        return scores;
    } catch (err) {
        console.log(err);
        throw err;
    }
}
//generate level mode score
const level = async (winscore) => {
    try {
        let scores = {};
        scores.fscore = Math.floor((winscore - 2)/2) + 2;
        scores.sscore = Math.floor((winscore - 2)/2) + 2;
        return scores;
    } catch (err) {
        console.log(err);
        throw err;
    }
}

// rank mode functions

const MatchLib = {
    generateScore,
    updateById,
    setGamestartingFlag,
    getGamestartingFlag
}

module.exports = MatchLib;