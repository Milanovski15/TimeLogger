const chai= require('chai');
const chaiHttp = require('chai-http');
const should = chai.should();
const expect = chai.expect;
const moment = require('moment');

chai.use(chaiHttp);

let api_url='http://localhost:4000/api/';

if(process.env && process.env.MOCHA_ENV && process.env.MOCHA_ENV === "dev"){
    api_url = "http://localhost:3000/";
}

describe('routes',function(){

    it("Should list all the user from the database.",function(done){
        chai.request(api_url)
            .get("all")
            .end(function(err,res){
                res.should.have.status(200);
                res.should.be.json;
                res.body.should.have.length.above(-1);
                done();
            })
    });

    let userID=0;

    it("Should add a user into the database.",function(done){

        let data= {
            name:"Stefan",
            surname:"Milanovski",
            active:true
        };
        chai.request(api_url)
            .post("add")
            .send(data)
            .end(function(err,res){
                res.should.have.status(200);
                res.should.be.json;
                res.body.should.have.property('name');
                res.body.should.have.property('surname');
                res.body.should.have.property('active');

                res.body.name.should.equal("Stefan");
                res.body.surname.should.equal("Milanovski");

                userID=res.body._id;
                done();
            })
    });


    it("Should update a users information from the database.",function(done){

        let data= {
            name:"Stefannnn",
            surname:"Milanovskiiiiii",
            active:true
        };

        chai.request(api_url)
            .post("update/"+ userID)
            .send(data)
            .end(function(err,res){
                userID=res.body._id;
                res.should.have.status(200);
                res.should.be.json;
                res.body.should.have.property('_id');
                res.body.should.have.property('name');
                res.body.should.have.property('surname');
                res.body.should.have.property('active');

                res.body._id.should.equal(userID);
                res.body.name.should.equal("Stefannnn");
                res.body.surname.should.equal("Milanovskiiiiii");

                done();
            })
    });

    it("Should start the working time for the user",function(done){

        chai.request(api_url)
            .post("start/"+userID)
            .send()
            .end(function (err,res) {
                res.should.have.status(200);
                res.should.be.json;
                done();
            })


    });


    it("Should start the pause.",function(done){
        chai.request(api_url)
            .post("startP/"+userID)
            .send()
            .end(function(err,res){
                res.should.be.json;
                res.should.have.status(200);
                done();
            })

    });

    it("Should end the pause.",function(done){
        chai.request(api_url)
            .post("endP/"+userID)
            .send()
            .end(function(err,res){
                res.should.have.status(200);
                res.should.be.json;
                done();
            })

    });

    it("Should end the working.",function(done){
        chai.request(api_url)
            .post("end/"+userID)
            .send()
            .end(function(err,res){
                res.should.have.status(200);
                res.should.be.json;
                done();
            })

    });


    it("Should delete a user from the database.",function(done){
        chai.request(api_url)
            .get("delete/"+ userID)
            .end(function(err,res){
                res.should.have.status(200);
                done();
            })
    });


});