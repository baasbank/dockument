import chai from 'chai';
import models from '../../models/';
import data from '../mockData';

const expect = chai.expect;
const { fakeAudax } = data;
let dummyId;

describe('User Model', () => {
  describe('Create a new User', () => {
    it('should create a user', (done) => {
      models.User.create(fakeAudax)
        .then((user) => {
          expect(user.dataValues.fullName).to.equal(fakeAudax.fullName);
          dummyId = user.dataValues.id;
          done();
        });
    });
    it('should return a message for an empty name field', (done) => {
      fakeAudax.fullName = '';
      models.User.create(fakeAudax)
        .then()
        .catch((err) => {
          expect(err.errors[0].message).to.eql('Name field cannot be empty.');
          done();
        });
    });
  });
  describe('Update User', () => {
    it('should update a user', (done) => {
      models.User.findById(dummyId)
        .then((user) => {
          user.update({ email: 'audax@test.com', password: 'audaxes' })
            .then((updatedUser) => {
              expect(updatedUser.dataValues.id).to.equal(dummyId);
              expect(user.dataValues.email).to.equal('audax@test.com');
              done();
            });
        });
    });
  });
});
