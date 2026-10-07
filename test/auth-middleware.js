const expect = require('chai').expect;
const authMiddleware = require('../middleware/auth');
const jwt = require('jsonwebtoken');
const sinon = require('sinon')

describe('Auth Middleware', function(){
    it('should throw an error if no authorization header is provided', function(){
        const req = {
            get: function(headerName){
                return null
            }
        }
        expect(authMiddleware.bind(this, req, {}, () => {})).to.throw('Not Authenticated')
    });

    it('should throw an error if no bearer token provided is invalid', function(){
        const req = {
            get: function(headerName){
                return "addadadadadadadadadadad"
            }
        }
        expect(authMiddleware.bind(this, req, {}, () => {})).to.throw('Not Authenticated')
    });

    it('should put a userId on the request object if the token is valid', function(){
        const req = {
            get: function(headerName){
                return "Bearer addadadadadadadadadadad"
            }
        }
        
        sinon.stub(jwt, 'verify');
        jwt.verify.returns({userId: 'abc'})

        authMiddleware(req, {}, () => {});
        expect(req).to.have.property('userId')
        jwt.verify.restore();
    });
})



