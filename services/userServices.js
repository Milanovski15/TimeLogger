const userModel = require('../models/person.js');
const dateFormat = 'yyyy-MM-dd';
const moment = require('moment');

const findUsers = async () => {
    return await userModel.find().then(async(per)=>{
            return  per;
    });

};
exports.findUsers = findUsers;

const findUser = async (id) => {

    return await userModel.findById(id).then(async(per)=>{
        return per;
    });

};
exports.findUser = findUser;

const findUserBySlackId = async (slackId) => {
    return await userModel.findOne({
        slackId: slackId
    }).then((per)=>{
        return per;
    }).catch((err) => {
        return null;
    });

};
exports.findUserBySlackId = findUserBySlackId;

const insertUser= async(add) => {

   return  userModel.create(
        {
            name:add.name,
            surname:add.surname,
            active:add.active,
            slackId: add.slackId,
            email: add.email,
            card: null
        },
        function (error, per ) {
            if (error) {
                return false;
            }
            return per;
        }
    )

};
exports.insertUser=insertUser;

const deleteUser= async() =>{
    let id=req.params.id;
    userModel.findByIdAndRemove(id).then( function(per){
        if(err){
            return false;
        }
        return true;
    });
};
exports.deleteUser=deleteUser;

const updateUser= async(id,userData) =>{
    return userModel.findById(id).then(function(per){
                per.name=userData.name;
                per.surname=userData.surname;
                per.active=userData.active;
                per.card=null;
                return per.save().then(function(res){
                    return res;
                }).catch(function(error){
                    return false;
                });

    }).catch(function(error){return false;});

};
exports.updateUser=updateUser;

const startWorkingTime= async (id) => {
    let now = moment(new Date()).format(dateFormat);
    return userModel.findById(id).then(function(per){
                const timeLog = {
                    startTime:moment()
                };
                const timeLogOld = per.timeLogs.find((timeLogEntry)=> {
                    let timeLogDate = moment(timeLogEntry.startTime).format(dateFormat);
                    return now === timeLogDate
                });
                if(!timeLogOld) {
                    per.timeLogs.push(timeLog);
                    return per.save().then(function (time) {
                        return time;
                    }).catch(function (error) {
                        return false;
                    });
                }
                return false;
    }).catch(function(error){return false;});
};
exports.startWorkingTime= startWorkingTime;


const endWorkingTime= async(id) =>{

    let now = moment(new Date()).format(dateFormat);
    return userModel.findById(id).then(function(per){
                for (let i = 0; i < per.timeLogs.length; i++) {
                    let startTime = per.timeLogs[i].startTime;
                    if (startTime) {
                        let timeLogDate = moment(startTime).format(dateFormat);
                        if (timeLogDate === now) {
                            per.timeLogs[i].endTime = new Date();
                        }
                    }
                }
                return per.save().then(function (per) {
                    return per;
                }).catch(function (error) {
                    return false;
                });

            }).catch(function(error){
                return false;
            });

};
exports.endWorkingTime=endWorkingTime;

const startPauseTime= async(id) =>{
    let now = moment(new Date()).format(dateFormat);

    return userModel.findById(id).then(function(per){
        for (let i = 0; i < per.timeLogs.length; i++) {
            let startTime = per.timeLogs[i].startTime;
            if (startTime && !per.timeLogs[i].endPause) {
                let timeLogDate = moment(startTime).format(dateFormat);
                if (timeLogDate === now) {
                    per.timeLogs[i].startPause = new Date();
                }
            }
        }
        return per.save().then(function (per) {
            return per;
        }).catch(function (error) {
            return false;
        });

    }).catch(function(error){
        return false;
    });

};
exports.startPauseTime=startPauseTime;

const endPauseTime = async(id) =>{
    let now = moment(new Date()).format(dateFormat);

    return userModel.findById(id).then(function(per){
        for (let i = 0; i < per.timeLogs.length; i++) {
            let startTime = per.timeLogs[i].startTime;
            if (startTime && per.timeLogs[i].startPause) {
                let timeLogDate = moment(startTime).format(dateFormat);
                if (timeLogDate === now) {
                    per.timeLogs[i].endPause = new Date();
                }
            }
        }
        return per.save().then(function (per) {
            return "No start of the working time for this user";
        }).catch(function (error) {
            return false;
        });

    }).catch(function(error){
        return false;
    });


};
exports.endPauseTime=endPauseTime;


