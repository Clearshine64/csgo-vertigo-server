const ConfigLib = require('./configlib');

const ClientLib = require('./clientlib');

const AccountLib = require('./accountlib');

const initial = async () => {
    //clear account's statusflag to initial from grouped, useful
    await AccountLib.clearStatusFlagDesc();

    //clear client's useful flag to flase
    await ClientLib.clearClient();

    //delete group db
    // await GroupLib.deleteGroupDB();

    //delete match db
    //await MatchLib.deleteMatchDB();

    //set config db
    await ConfigLib.InitialDB();

    console.log("Initialize is complete");
}

const serverLib = {
    initial
}

//muset use default when you export bulk data
//export default serverLib

module.exports = serverLib;