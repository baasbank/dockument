import chai from 'chai';
import models from '../../models/';
import mockData from '../MockData';

const expect = chai.expect;
const { fakeAudax } = mockData;
let dummyId;

describe('User Model', () => {
  describe('models.User.create()', () => {
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
  describe('models.User.update', () => {
    it('should update a user given', (done) => {
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
