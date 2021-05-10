const Clients = require('../models/clients');

const GlobalLib = require('./globallib');

const ConfigLib = require('./configlib');

//check if ip is already registered
const verifyIPforDuplicateAndCapacity = async (data, id) => {
    data.clientip = data.clientip || "";
    if (data.clientip.length == 0)
        throw "ip must be specified";

    //if id is specified, this is called from update
    if (id || 0) {
        const client = await Clients.findById(id);
        if (client.clientip == data.clientip)    //case for updating password in same ip 
            return;
    }

    let result = await find({ clientip: data.clientip });
    if (result.length >= 1) {
        throw data.clientip + " is alreay inserted";
    }

    //check capacity
    if (!Boolean(data.capacity)) throw "capacity field must be specified";
}

//for user's action from browser and have several verify function
//don't use it for socket
const updateById = async (id, data) => {
    try {
        GlobalLib.verifyID(id);
        await verifyIPforDuplicateAndCapacity(data, id);

        const client = await Clients.findByIdAndUpdate(id, data) || {};
        return client;
    } catch (err) {
        console.log(err);
        throw err;
    }
}

//mongoose operation find
const find = async (data) => {
    try {
        const result = await Clients.find(data);
        return result;
    } catch (err) {
        console.log(err);
        throw err;
    }
}


//====================================================//
//from socket in ping on my side
const setUsefulFlag = async (ip, flag) => {
    try {
        let client = await find({ clientip: ip }) || [];
        //change client's useful flag
        //format groupids because 
        if (client.length == 1) {
            if (flag)
                await Clients.findByIdAndUpdate(client[0]._id, { useful: flag });
            else
                await Clients.findByIdAndUpdate(client[0]._id, { groupids: [], res: {cpu:0, availableRam:0, totalRam:0}, useful: flag, });
        }
        else if (client.length == 0)
            return;
        else
            throw "error occured in setusefulflag in clientlib";

    } catch (err) {
        console.log(err);
        throw err;
    }
}

//from client's information
const updateResource = async (ip, resource) => {
    try {
        let client = await find({ clientip: ip }) || [];
        //change client's useful flag and resourcedata
        if (client.length == 1) {
            await Clients.findByIdAndUpdate(client[0]._id, { res: { cpu: resource.cpu, availableRam: resource.availableRam, totalRam: resource.totalRam }, useful: true });
        }
        else
            throw "error occured in updateResource in clientlib";

    } catch (err) {
        console.log(err);
        throw err;
    }
}

//check if ip is registered
const isRegistered = async (ip) => {
    try {
        let client = await find({ clientip: ip }) || false;
        let result = (client.length) ? true : false;

        return result;
    } catch (err) {
        console.log(err);
        throw err;
    }
}

//cregister new client
const createClient = async (data) => {
    try {
        //check if this client is already in db
        await verifyIPforDuplicateAndCapacity(data);

        GlobalLib.verifyMatchMode(data.matchmode);

        const newClient = await Clients.create({ matchmode: data.matchmode, clientip: data.clientip, capacity: data.capacity, useful: false ,res: {cpu:0, availableRam:0, totalRam:0}});
        return newClient;
    } catch (err) {
        console.log(err);
        throw err;
    }
}

//remove client
const removeById = async (id) => {
    try {
        GlobalLib.verifyID(id);
        await Clients.findByIdAndRemove(id);
    } catch (err) {
        console.log(err);
        throw err;
    }
}

//get client by id
const getClientByID = async (id) => {
    try {
        GlobalLib.verifyID(id);
        return await Clients.findByIdAndRemove(id);
    } catch (err) {
        console.log(err);
        throw err;
    }
}

//get all clients according matchmode
const getAllClients = async (mode) => {
    try {
        GlobalLib.verifyMatchMode(mode);

        const clients = await find({ matchmode: mode });
        return clients;
    } catch (err) {
        console.log(err);
        throw err;
    }
}

//get number of clients according to matchmode
const getNumberOfClients = async (mode) => {
    try {
        GlobalLib.verifyMatchMode(mode);
        const clients = await find({ matchmode: mode });

        let number = 0;
        for (const client of clients) {
            number++;
        }
        return number;
    } catch (err) {
        console.log(err);
        throw err;
    }
}

//get total available groups that all clients can run
const GetTotalAvailableGroups = async () => {
    try {
        //select useful clients : online client
        const usefulClients = await find({ useful: true });

        //sum
        let sum = 0;
        for (const value of usefulClients) {
            sum += value.usefulgroup;
        }
        return sum;
    } catch (err) {
        console.log(err);
        throw err;
    }
}


//clear clients' info when server starts up
const clearClient = async () => {
    try {
        let clients = await find({});
        for (const value of clients) {
            await Clients.findByIdAndUpdate(value._id, { groupids: [], useful: false ,res: {cpu:0, availableRam:0, totalRam:0}});
        }

    } catch (err) {
        console.log(err);
        throw err;
    }
}

//get client by id
const findByIdAndUpdate = async(clientid, data) =>{
    try{
        GlobalLib.verifyID(clientid);

        await Clients.findByIdAndUpdate(clientid, data);
    } catch(err)
    {
        console.log(err);
        throw err;
    }
}

const ClientLib = {
    getAllClients,
    GetTotalAvailableGroups,
    clearClient,
    createClient,
    updateById,
    removeById,
    find,
    getClientByID,
    getNumberOfClients,
    findByIdAndUpdate,
    isRegistered,
    setUsefulFlag,
    updateResource,
}

module.exports = ClientLib;