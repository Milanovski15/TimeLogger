const express = require('express');
const moment = require('moment');
const appRoutes=express.Router();
const appModel = require('../models/person.js');
const userServices = require('../services/userServices');
const dateFormat = 'yyyy-MM-dd';

//all users added into the db
appRoutes.get('/all', async(req, res)=>{
    const results = await userServices.findUsers();
    if(results){
        return res.json(results);
    }else{
        return res.status(500);
    }
});

appRoutes.get('/user/:id', async(req, res)=>{
    let id=req.params.id;
    const results = await userServices.findUser(id);
    if(results){
        return res.json(results);
    }else{
        return res.status(500);
    }
});

//add a user into the db
appRoutes.route('/add').post(async function(req,res){
   let add=req.body;
   const per= await userServices.insertUser({
       name:add.name,
       surname:add.surname,
       active:add.active,
       card:add.null
   });
    if (!per) {
        res.status(400).send('Unable to add the user into the db');
    }else{
        res.status(200).json(per);
    }

});

//delete a user from the db
appRoutes.route('/delete/:id').get(async function(req,res, next){
    let id=req.params.id;
    appModel.findByIdAndRemove(id, function (err){
        if(err){
            return next (new Error ('User is not found !!!' ));
        }
        res.json('The user is successfully removed');
    });
});


//update a users info in the database
appRoutes.route('/update/:id').post(async function (req,res,next){
    const id=req.params.id;
    const userData = req.body;
    const per = await userServices.updateUser(id,userData);
    if(!per){
        res.status(400).send('Unable to update the users info');
    } else{
        res.status(200).json(per);
    }

});

//start of the working time
appRoutes.route('/start/:id').post(async function(req,res,next){
    let id=req.params.id;
    const time = await userServices.startWorkingTime(id);
    if(!time){
        res.status(400).send('Unable to update the time');
    }else{
        res.status(200).json(time);

    }
});

//end of the working time
appRoutes.route('/end/:id').post(async function (req,res,next){
    let id=req.params.id;
    const time = await userServices.endWorkingTime(id);

    if(!time){
        res.status(400).send('Unable to update the end time');
    } else{
        res.status(200).json(time);
    }

});

//start of a pause
appRoutes.route('/startP/:id').post(async function (req,res,next) {
    let id=req.params.id;
    const time = await userServices.startPauseTime(id);

    if(!time){
        res.status(400).send('Unable to update the pause time');
    } else{
        res.status(200).json(time);
    }

});

//end of the pause
appRoutes.route('/endP/:id').post(async function (req,res,next){
    let id=req.params.id;
    const time = await userServices.endPauseTime(id);

    if(!time){
        res.status(400).send('Unable to update the pause time');
    } else{
        res.status(200).json(time);
    }

});

module.exports=appRoutes;