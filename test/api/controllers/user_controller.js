var should = require('should');
var request = require('supertest');
var server = require('../../../app');
require('dotenv').config()

process.env.A127_ENV = 'test';

describe('controllers', function() {

  describe('user_controller', function() {

    describe('POST /signup', function() {

      it('should signup', function(done) {

        request(server)
          .post('/signup')
          .send({ name: 'Shawn', username: 'shawn1', password: 'p@ssword'})
          .set('Accept', 'application/json')
          .expect(200)
          .end(function(err, res) {
            should.not.exist(err);

            res.body.message.should.eql('User created!');

            done();
          });
      });

    });

      describe('POST /signin', function() {

          it('should signin', function(done) {

              request(server)
                  .post('/signin')
                  .send({ name: 'Shawn', username: 'shawn1', password: 'p@ssword'})
                  .set('Accept', 'application/json')
                  .expect(200)
                  .end(function(err, res) {
                      should.not.exist(err);

                      done();
                  });
          });

      });
  });

});
