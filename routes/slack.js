const express = require('express');
const superagent = require('superagent');
const userServices = require('../services/userServices');
const appRoutes = express.Router();

const getUserDetails = async(userId) => {
    const response = await superagent
        .get('https://slack.com/api/users.info')
        .query({
            token: "xoxb-578390257797-579138098487-a9fy9r7T64wC8GTkNnkEfX8D",
            user: userId
        });
    if(response && response.ok){
        return response.body.user.profile;
    }
    return false;
};

appRoutes.post('/event', async(req, res) => {
    const incomingData = req.body;
    if(incomingData.challenge){
        return res.status(200).json(req.body.challenge);
    }else {
        if(incomingData.event.type === "message"){
            const slackId = incomingData.event.user;
            const userDB = await userServices.findUserBySlackId(slackId);
            let userId;
            if(userDB){
                userId = userDB.id;
            }else{
                const userData = await getUserDetails(slackId);
                const userNew = await userServices.insertUser({
                    name: userData.first_name,
                    surname: userData.last_name,
                    email: userData.email,
                    slackId: slackId,
                    active: true
                });
                userId = userNew.id;
            }

            if(incomingData.event.text.toLowerCase() === "hello" || incomingData.event.text.toLowerCase()=== "hi" || incomingData.event.text.toLowerCase()=="zdravo" ){
                await userServices.startWorkingTime(userId);
            }else if(incomingData.event.text.toLowerCase() === "bye" || incomingData.event.text.toLowerCase()=== "good bye" || incomingData.event.text.toLowerCase()=="cao"){
                await userServices.endWorkingTime(userId);
            }else if(incomingData.event.text.toLowerCase() === "pause" || incomingData.event.text.toLowerCase()=== "start pause" || incomingData.event.text.toLowerCase()=="pauza" ){
                await userServices.startPauseTime(userId);
            }else if(incomingData.event.text.toLowerCase() === "end pause" || incomingData.event.text.toLowerCase()=== "" || incomingData.event.text.toLowerCase()=="kraj pauza" ){
                await userServices.endPauseTime(userId);
            }
        }
        return res.status(200).json({ok:true});
    }
});

module.exports = appRoutes;