'use strict';
let chai = require('chai');
let chaiHttp = require('chai-http');
chai.use(chaiHttp);

let server = require('../backup/index');
let should = chai.should();

const expect = require('chai').expect;

describe('#APIHealthCheck', function() {

    it('should have testing enabled', function() {
        let result = true;
        expect(result).to.equal(true);
    });

});

describe('#APIHealthCheck /GET', function() {

    it('should return a HTML home page with 200 response', function() {
        chai.request(server)
            .get('/')
            .end((err, res) => {
                res.should.have.status(200);
                res.should.be.html;
                //res.body.should.be.a('array');
                //res.body.length.should.be.eql(0);
                done();
            });

    });
    it('should return a 400 response for unfound webpages', function() {
        chai.request(server)
            .get('/unfound')
            .end((err, res) => {
                res.should.have.status(400);
                done();
            });
    });

    it('should return a 200 response and array of summary health checks', function() {
        chai.request(server)
            .get('/v1/HealthCheckSummary')
            .end((err, res) => {
                res.should.have.status(200);
                res.should.be.json(res);
                done();
            });
    });

});