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
                per.emacr=userData.email;
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
                    startTime: moment()
                };

                const timeLogOld = per.timeLogs.find((timeLogEntry)=> {
                    let timeLogDate = moment(timeLogEntry.startTime).format(dateFormat);
                    return now === timeLogDate;
                });
                if(!timeLogOld) {
                    per.timeLogs.push(timeLog);
                    return per.save().then(function (time) {
                        return time;
                    }).catch(function (error) {
                        return false;
                    });
                }
                return { alreadyLoggedTime: true };
    }).catch(function(error){return false;});
};
exports.startWorkingTime= startWorkingTime;


const endWorkingTime= async(id) =>{

    let now = moment(new Date()).format(dateFormat);
    return userModel.findById(id).then(function(per){
        let noStartTime=true;
        for (let i = 0; i < per.timeLogs.length; i++) {
            let startTime = per.timeLogs[i].startTime;
            if (startTime) {
                let timeLogDate = moment(startTime).format(dateFormat);
                if (timeLogDate === now) {
                    noStartTime=false;
                    if(!per.timeLogs[i].endPause && per.timeLogs[i].startPause){
                        return {noEndPause: true};
                    }
                    per.timeLogs[i].endTime = new Date();
                }
            }
        }
        if(noStartTime){
            return {noStartTime};
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
    let noEntry = true;
    return userModel.findById(id).then(function(per){
        for (let i = 0; i < per.timeLogs.length; i++) {
            let startTime = per.timeLogs[i].startTime;
            let timeLogDate = moment(startTime).format(dateFormat);
            if (timeLogDate === now) {
                noEntry=false;
                if(startTime && per.timeLogs[i].endPause) {
                    return {alreadyPause: false}
                }
                if (!per.timeLogs[i].startTime ){
                    return {noStartTime: true};
                }
                if (startTime && !per.timeLogs[i].endPause) {
                    per.timeLogs[i].startPause = new Date();
                }
            }
        }
        if(noEntry){
            return {noStartTime: true};
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
    let noStartPauseEntry = true;
    return userModel.findById(id).then(function(per){
        for (let i = 0; i < per.timeLogs.length; i++) {
            let startTime = per.timeLogs[i].startTime;
            let timeLogDate = moment(startTime).format(dateFormat);
            if (timeLogDate === now) {
                if( startTime && per.timeLogs[i].startPause && per.timeLogs[i].endPause){
                    return {alreadyEndedPause : true};
                }
                if (startTime && per.timeLogs[i].startPause && !per.timeLogs[i].endPause) {

                    per.timeLogs[i].endPause = new Date();
                    noStartPauseEntry = false;
                }
            }
        }
        if(noStartPauseEntry){
            return {noStartPauseTime: true};
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
exports.endPauseTime=endPauseTime;


