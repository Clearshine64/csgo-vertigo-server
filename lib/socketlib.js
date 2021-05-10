//Api for socket
const AccountLib = require('./accountlib');
const ClientLib = require('./clientlib');
const MatchTicketLib = require('./matchticketlib');

//for dashboard info
const getBrowserRealtimeInfo = async (mode) => {
    try{
        let result = {};
        result.accounts = await AccountLib.getStatisticInfo(mode) || {};
        result.clients = await ClientLib.getAllClients(mode)|| {}; // must add client res info here
        result.matches = await MatchTicketLib.getPlayingMatchInfo(mode)|| {};

        return result;
    } catch (err) {
        console.log(err);
    }

};

const SocketLib = {
    getBrowserRealtimeInfo
}

module.exports = SocketLib;