const mongoose = require("mongoose");
const conn = require("../dbconnect");

const Person = new mongoose.Schema({
        name: {
            type: String
        },
        surname: {
            type: String
        },
        active: {
            type: Boolean
        },
        slackId:{
            type:String
        },
        email:{
            type:String
        },
        card: {
            type: String
        },
        timeLogs: [
            {
                startTime: {
                    type: Date
                },
                endTime: {
                    type: Date
                },
                startPause: {
                    type: Date
                },
                endPause: {
                    type: Date
                }
            }
        ]
    },
    {
        collection: 'users',
        usePushEach: true
    }
);

module.exports = conn.model('person', Person);