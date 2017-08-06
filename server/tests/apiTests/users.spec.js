import chai from 'chai';
import http from 'chai-http';
import app from '../../../app';
import models from '../../models/';
import data from '../mockData';


const expect = chai.expect;
chai.use(http);

const { admin } = data;
// , superUser, regularUser, fakeEsther, fakeUserDetails

describe('Users', () => {
  after((done) => {
    models.User.destroy({ where: { id: { $notIn: [1, 2, 3] } } });
    done();
  });
  describe('user login endpoint', () => {
    it('should log in a user and return a token', (done) => {
      chai.request(app)
        .post('/api/v1/users/login').send(admin).end((err, res) => {
          expect(res.status).to.equal(201);
          expect(res.body).to.have.keys(['message', 'token']);
          expect(res.body.message).to.eql('login successful');
          done();
        });
    });
  });
});
