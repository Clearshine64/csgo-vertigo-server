//throwable lib

//verify match mode
const verifyMatchMode = (mode) => {
    switch (mode) {
        case "openrank":
            break;
        case "onlylose":
            break;
        case "level":
            break;
        default:
            throw "matchmode is incorrect";
    }
}

//verify mongo db id
const verifyID = (Id) => {
    if (Id == null || Id == undefined)
        throw "Id error"
    if (Id.toString().length != 24)
        throw "Id length must be 24";
}

const GlobalLib = {
    verifyMatchMode,
    verifyID
}

module.exports = GlobalLib;