const Matchtickets = require('../models/matchticket');
const GlobalLib = require('./globallib');

//for dashboard information
const getPlayingMatchInfo = async (mode) => {
    try {
        let result = await Matchtickets.find({ status: "processing", matchmode: mode }) || {};

        //add group accounts info
        return result;
    } catch (err) {
        console.log(err);
        throw err;
    }
}

//score is losenumber not winnumber
const createMatchTicket = async (mode, fgroupid, sgroupid, fscore, sscore, status) => {
    try {
        GlobalLib.verifyMatchMode(mode);
        //delete already created ticket with fgroupid and sgroupid
        let tickets = await Matchtickets.find({ matchmode: mode});
        for(let ticket of tickets)
        {
            if (ticket.lobby.firstgroupid == fgroupid || ticket.lobby.firstgroupid == sgroupid || ticket.lobby.secondgroupid == fgroupid || ticket.lobby.secondgroupid == sgroupid) {
                await Matchtickets.findByIdAndDelete(ticket._id);
            }            
        }

        //create new ticket
        let fprio = 1;
        let sprio = 1;

        if (fscore <= sscore) sprio = 2 //seconteam should run clicker after firstteam
        else fprio = 2; //seconteam should run clicker after firstteam

        let matchticket = await Matchtickets.create({ matchmode: mode, lobby: { firstgroupid: fgroupid, secondgroupid: sgroupid }, score: { firstgroup: fscore, secondgroup: sscore }, priority: { firstgroup: fprio, secondgroup: sprio }, status: status });
        console.log({matchticket});

    } catch (err) {
        console.log(err);
        throw err;
    }
}

//get matchscore from matchticket with group id
const getMatchScoreByGroupid = async (mode, groupid) => {
    try {
        let tickets = [];
        let inittickets = await Matchtickets.find({ matchmode: mode, status: "initial"});
        let processingtickets = await Matchtickets.find({ matchmode: mode, status: "processing"});

        tickets = inittickets.concat(processingtickets);

        for (let ticket of tickets) {
            if (ticket.lobby.firstgroupid == groupid) {
                let result = { matchscore: ticket.score.firstgroup, match_priority: ticket.priority.firstgroup };
                return result;
            }
            if (ticket.lobby.secondgroupid == groupid) {
                let result = { matchscore: ticket.score.secondgroup, match_priority: ticket.priority.secondgroup };
                return result;
            }
        }

    } catch (err) {
        console.log(err);
        throw err;
    }
}

//update ticket's status flag
const updateTicketFlag = async (mode, groupid, status) => {
    try {
        let tickets = await Matchtickets.find({ matchmode: mode });

        for (ticket of tickets) {
            if (ticket.lobby.firstgroupid == groupid || ticket.lobby.secondgroupid == groupid)
                await Matchtickets.findByIdAndUpdate(ticket._id, { status: status });
        }
    } catch (err) {
        console.log(err);
        throw err;
    }
}

//check if one group is lose according to matchticket
const isGroupidLose = async (mode, groupid) => {
    try {
        let tickets = await Matchtickets.find({ matchmode: mode });
        for (ticket of tickets) {
            if (ticket.lobby.firstgroupid == groupid) {
                if (ticket.score.firstgroup >= ticket.score.secondgroup) return true;
            }

            if (ticket.lobby.secondgroupid == groupid) {
                if (ticket.score.secondgroup >= ticket.score.firstgroup) return true;
            }
        }

        return false;
    } catch (err) {
        console.log(err);
        throw err;
    }
}

//delete match ticket by group ifd
const deleteTicketByGroupid = async (groupid) => {
    try {
        let tickets = await Matchtickets.find({}) || null;
        for (ticket of tickets) {
            if (ticket.lobby.firstgroupid == groupid) {
                await Matchtickets.findByIdAndDelete(ticket._id);
                return ticket.lobby.secondgroupid;
            }
            if (ticket.lobby.secondgroupid == groupid) {
                await Matchtickets.findByIdAndDelete(ticket._id);
                return ticket.lobby.firstgroupid;
            }
        }
        console.log("no ticket");
        return null;
    } catch (err) {
        console.log(err);
        throw err;
    }
}

//get opponent group id in one ticket
const getOpponentGroupId = async (groupid) => {
    try {
        let tickets = await Matchtickets.find({}) || null;
        for (ticket of tickets) {
            if (ticket.lobby.firstgroupid == groupid) {
                return ticket.lobby.secondgroupid;
            }
            if (ticket.lobby.secondgroupid == groupid) {
                return ticket.lobby.firstgroupid;
            }
        }
    } catch (err) {
        console.log(err);
        throw err;
    }
}

const MatchTicketLib = {
    getPlayingMatchInfo,
    createMatchTicket,
    getMatchScoreByGroupid,
    updateTicketFlag,
    isGroupidLose,
    deleteTicketByGroupid,
    getOpponentGroupId
}

module.exports = MatchTicketLib;