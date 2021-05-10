const Groups = require('../models/group');

const GlobalLib = require('./globallib');

const ConfigLib = require('./configlib');

//get existing group future needs
const getExistingGroup = async () => {
    try {
        const group = await Groups.find({});
        return group;
    } catch (err) {
        console.log(err);
        throw err;
    }
}

//future needs
const clearGroupFlag = async () => {
    try {
        const group = await Groups.find({});
        for (const value of group) {
            await Groups.findByIdAndUpdate(value._id, {useful: false});
        }

        return group;
    } catch (err) {
        console.log(err);
        throw err;
    }
}

//set group's falg 
const setGroupFlag = async (groupid, flag) => {
    try {
        await Groups.findByIdAndUpdate(groupid, { useful: flag });
    } catch (err) {
        console.log(err);
        return err;
    }
}

//create new group
const createGroup = async(data) => {
    try{
        GlobalLib.verifyMatchMode(data.matchmode);
        
        await Groups.create(data);
    } catch(err) {
        console.log(err);
        throw err;
    }
}

//get group by id
const findById = async(id) => {
    try{
        GlobalLib.verifyID(id);

        let group = await Groups.findById(id) || null;

        if(group == null) throw id + "group is not exist";

        return group;

    } catch (err) {
        console.log(err);
        throw err;
    }
}

//find group
const find = async(data) => {
    try{
        return await Groups.find(data);
    } catch(err) {
        console.log(err);
        throw err;
    }
}

//get match mode
const getMatchMode = async(groupid) => {
    try{
        let group = await Groups.findById(groupid) || null;
        if(group == null) 
        {
            let err;
            err.groupid = groupid;
            err.desc =  "group is changed in vertigo";
            throw err;
        }

        return group.matchmode;
    } catch(err) {
        console.log(err);
        throw err;
    }
}

const GroupLib = {
    createGroup,
    getExistingGroup,
    clearGroupFlag,
    setGroupFlag,
    findById,
    find,
    getMatchMode
}

module.exports = GroupLib;