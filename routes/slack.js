const express = require('express');
const superagent = require('superagent');
const userServices = require('../services/userServices');
const slackBot = require('slackbots');
const appRoutes = express.Router();
const userModel = require('../models/person');


const cb = function (res, err) {
    if(err){
        console.log('Error! ' + err);
        return;
    }
    console.log("OK", res);
};

const bot = new slackBot({
    token: 'sometoken',
    name: 'timeLogger'
});
const params = {
    icon_emoji: ':smiley:'
};

bot.on('start', () => {
    bot.postMessageToChannel('time-logger', 'Your working time will be recorded :)', params, cb);
});

const getUserDetails = async (userId) => {
        const response = await superagent
            .get('https://slack.com/api/users.info')
            .query({
                token: "sometoken",
                user: userId
            });
    if (response && response.ok) {
        return response.body.user.profile;
    }
    return false;
};

appRoutes.post('/event', async (req, res) => {
    const incomingData = req.body;
    if (incomingData.challenge) {
        return res.status(200).json(req.body.challenge);
    } else {
        if (incomingData.event.type === "message") {
            const slackId = incomingData.event.user;
            const channelId = incomingData.event.channel;
            const userDB = await userServices.findUserBySlackId(slackId);
            let userId;
            if (userDB) {
                userId = userDB.id;
            } else {
                const userData = await getUserDetails(slackId);
                const userNew = await userServices.insertUser({
                    name: userData.first_name,
                    surname: userData.last_name,
                    email: userData.email,
                    slackId: slackId,
                    active: true

                });
                userId = userNew.id;
                bot.postMessageToChannel('time-logger', `Welcome ${userData.first_name} to our workspace, you have been added into the database`, params, cb);
            }

            if (incomingData.event.text.toLowerCase() === "hello" || incomingData.event.text.toLowerCase() === "hi") {
                const { alreadyLoggedTime: wasOld = false } = await userServices.startWorkingTime(userId);
                if(wasOld){
                    bot.postEphemeral(channelId, slackId, 'Your working time has been already recorded :)', params)
                } else {
                    bot.postEphemeral(channelId, slackId, 'Your working time was recorded :)', params)
                }
            } else if (incomingData.event.text.toLowerCase() === "bye" || incomingData.event.text.toLowerCase() === "goodbye" ) {
                const { noStartTime = false,noEndPause=false } =await userServices.endWorkingTime(userId);
                if(noStartTime ){
                    bot.postEphemeral(channelId, slackId, 'You don\'t have start time for today :)', params);
                }else if(noEndPause){
                    bot.postEphemeral(channelId, slackId, 'You have to end the pause in order to finish the working time :)', params);
                }
                else {
                    bot.postEphemeral(channelId, slackId, 'Your working time has ended :)', params);

                }

            } else if (incomingData.event.text.toLowerCase() === "pause" || incomingData.event.text.toLowerCase() === "start pause") {
                const { alreadyPause: pause = false, noStartTime = false } = await userServices.startPauseTime(userId);
                if(noStartTime){
                    bot.postEphemeral(channelId, slackId, 'You don\'t have start time for today :)', params);
                } else {
                    bot.postEphemeral(channelId, slackId, 'Your pause time was recorded or updated:)', params);
                }

            } else if (incomingData.event.text.toLowerCase() === "end pause" ) {
                const { noStartPauseTime: noPause = false,noStartTime = false } = await userServices.endPauseTime(userId);
                if(noPause){
                    bot.postEphemeral(channelId, slackId, 'You haven\'t started your pause time :)', params);
                }else{
                    await userServices.endPauseTime(userId);
                    bot.postEphemeral(channelId, slackId, 'Your pause time has ended :)', params);
                }

            }
        }
        return res.status(200).json({ok: true});
    }
});


module.exports = appRoutes;