import chai from 'chai';
import http from 'chai-http';
import app from '../../../app';
import models from '../../models/';
import mockData from '../MockData';


const expect = chai.expect;
chai.use(http);

const { admin,
  regularUser,
  superUser,
  incompleteLoginCredentials, 
  fakeEsther,
  fakeUserDetails,
  updateUser,
  userPasswordMismatch } = mockData;

let adminToken;
let regularUserToken;
let superUserToken;

describe('Users', () => {
  before((done) => {
    chai.request(app)
      .post('/api/v1/users/login')
      .send(admin)
      .end((err, res) => {
        adminToken = res.body.token;
        done();
      });
  });
  before((done) => {
    chai.request(app)
      .post('/api/v1/users/login')
      .send(regularUser)
      .end((err, res) => {
        regularUserToken = res.body.token;
        done();
      });
  });
  before((done) => {
    chai.request(app)
      .post('/api/v1/users/login')
      .send(superUser)
      .end((err, res) => {
        superUserToken = res.body.token;
        done();
      });
  });
  after((done) => {
    models.User.destroy({ where: { id: { $notIn: [1, 2, 3, 4, 5] } } });
    done();
  });
  describe('POST: /users/login', () => {
    it('should log in a user and return a token', (done) => {
      chai.request(app)
        .post('/api/v1/users/login').send(admin).end((err, res) => {
          expect(res.status).to.equal(200);
          expect(res.body).to.have.keys(['token']);
          done();
        });
    });
    it('should return a message for incomplete login details', (done) => {
      chai.request(app)
        .post('/api/v1/users/login').send(incompleteLoginCredentials).end((err, res) => {
          expect(res.status).to.equal(400);
          expect(res.body).to.have.keys(['message']);
          expect(res.body.message).to.eql('All fields are required');
          done();
        });
    });
    it('should return a message for password mismatch', (done) => {
      chai.request(app)
        .post('/api/v1/users/login').send(userPasswordMismatch).end((err, res) => {
          expect(res.status).to.equal(401);
          expect(res.body).to.have.keys(['message']);
          expect(res.body.message).to.eql('Invalid login credentials. Try again.');
          done();
        });
    });
  });
  describe('POST: /users/', () => {
    it('should return a message for incomplete user details', (done) => {
      chai.request(app)
        .post('/api/v1/users/').send(fakeUserDetails).end((err, res) => {
          expect(res.status).to.equal(206);
          expect(res.body).to.have.keys(['message']);
          expect(res.body.message).to.eql('All fields are required.');
          done();
        });
    });
    it('should create a new user', (done) => {
      chai.request(app)
        .post('/api/v1/users/').send(fakeEsther).end((err, res) => {
          expect(res.status).to.equal(201);
          expect(res.body).to.have.keys(['message', 'user']);
          expect(res.body.message).to.eql('signup successful');
          done();
        });
    });
  });
  describe('GET: /users/', () => {
    it('should return all users if user is admin', (done) => {
      chai.request(app)
        .get('/api/v1/users')
        .set({ 'Authorization': adminToken })
        .end((err, res) => {
          expect(res.status).to.equal(200);
          expect(Array.isArray(res.body.allUsers));
          expect(res.body.allUsers.length).to.be.greaterThan(2);
          done();
        });
    });
    // it('should return a message if a regular user accesses it', (done) => {
    //   chai.request(app)
    //     .get('/api/v1/users')
    //     .set({ 'Authorization': regularUserToken })
    //     .end((err, res) => {
    //       expect(res.status).to.equal(401);
    //       expect(res.body).to.have.keys(['message']);
    //       expect(res.body.message).to.eql('No authorization');
    //       done();
    //     });
    // });
    it('should paginate users if user is admin and limit and query is supplied', (done) => {
      chai.request(app)
        .get('/api/v1/users?limit=2&offset=0')
        .set({ 'Authorization': adminToken })
        .end((err, res) => {
          expect(res.status).to.equal(200);
          expect(Array.isArray(res.body.users));
          expect(res.body.users.length).to.be.greaterThan(1);
          expect(res.body).to.have.keys(['pagination', 'users']);
          done();
        });
    });
  });
  describe('GET: /users/:id', () => {
    it('should return a user given the user Id', (done) => {
      chai.request(app)
        .get('/api/v1/users/1')
        .set({ Authorization: regularUserToken })
        .end((err, res) => {
          expect(res.status).to.equal(200);
          expect(res.body).to.have.keys(['name', 'email', 'role']);
          expect(res.body.name).to.eql('Baas Bank');
          expect(res.body.email).to.eql('baas@test.com');
          expect(res.body.role).to.eql('admin');
          done();
        });
    });
    it('should return a message for invalid user id', (done) => {
      chai.request(app)
        .get('/api/v1/users/jkfjdkjfld')
        .set({ 'Authorization': adminToken })
        .end((err, res) => {
          expect(res.status).to.equal(400);
          expect(err.response.text).to.eql(`invalid input syntax for integer: "jkfjdkjfld"`);
          done();
        });
    });
  });
  describe('PUT: /users/:id', () => {
    it('should allow a user update her profile', (done) => {
      chai.request(app)
        .put('/api/v1/users/1')
        .send(updateUser)
        .set({ 'Authorization': adminToken })
        .end((err, res) => {
          expect(res.status).to.equal(200);
          expect(res.body).to.have.keys(['message', 'user']);
          expect(res.body.message).to.eql('Update Successful!');
          expect(res.body.user.userId).to.equal(1);
          expect(res.body.user.fullName).to.eql('Baas my man Bank');
          expect(res.body.user.email).to.eql('baasbank@test.com');
          done();
        });
    });
    it('should not allow a user update another user profile', (done) => {
      chai.request(app)
        .put('/api/v1/users/1')
        .send(updateUser)
        .set({ 'Authorization': regularUserToken })
        .end((err, res) => {
          expect(res.status).to.equal(403);
          expect(res.body).to.have.keys(['message']);
          expect(res.body.message).to.eql('You can update only your profile.');
          done();
        });
    });
    it('should not allow a user update her id', (done) => {
      chai.request(app)
        .put('/api/v1/users/4')
        .send({ id: 5 })
        .set({ 'Authorization': regularUserToken })
        .end((err, res) => {
          expect(res.status).to.equal(403);
          expect(res.body).to.have.keys(['message']);
          expect(res.body.message).to.eql('User ID cannot be updated.');
          done();
        });
    });
    it('should allow an admin update a user role type', (done) => {
      chai.request(app)
        .put('/api/v1/users/3')
        .send({ roleType: 'super user' })
        .set({ 'Authorization': adminToken })
        .end((err, res) => {
          expect(res.status).to.equal(200);
          expect(res.body).to.have.keys(['message', 'user']);
          expect(res.body.message).to.eql('Update Successful!');
          expect(res.body.user.roleType).to.eql('super user');
          done();
        });
    });
  });
  describe('DELETE: /users/:id', () => {
    it('should allow the admin delete a user', (done) => {
      chai.request(app)
        .delete('/api/v1/users/3')
        .set({ 'Authorization': adminToken })
        .end((err, res) => {
          expect(res.status).to.equal(410);
          expect(res.body).to.have.keys(['message']);
          expect(res.body.message).to.eql('User deleted successfully.');
          done();
        });
    });
    it('should return a message for invalid user id', (done) => {
      chai.request(app)
        .delete('/api/v1/users/jkfjdkjfld')
        .set({ 'Authorization': adminToken })
        .end((err, res) => {
          expect(res.status).to.equal(400);
          expect(err.response.text).to.eql('Error. Please try again');
          done();
        });
    });
    it('should return a message for user id not in the database', (done) => {
      chai.request(app)
        .delete('/api/v1/users/5')
        .set({ 'Authorization': adminToken })
        .end((err, res) => {
          expect(res.status).to.equal(404);
          expect(res.body.message).to.eql('User does not exist');
          done();
        });
    });
  });
  describe('GET: /search/users/?q={}', () => {
    it('should allow the admin search for a user by name', (done) => {
      chai.request(app)
        .get('/api/v1/search/users?search=john')
        .set({ 'Authorization': adminToken })
        .end((err, res) => {
          expect(res.status).to.equal(200);
          expect(res.body).to.have.keys(['pagination', 'users']);
          expect(res.body.pagination.totalCount).to.equal(1);
          expect(res.body.users[0].fullName).to.eql('John Bosco');
          expect(res.body.users[0].email).to.eql('john@test.com');
          done();
        });
    });
    it('should return a message if no user is found', (done) => {
      chai.request(app)
        .get('/api/v1/search/users?search=temilaj')
        .set({ 'Authorization': adminToken })
        .end((err, res) => {
          expect(res.status).to.equal(404);
          expect(res.body).to.have.keys(['message']);
          expect(res.body.message).to.eql('Search term does not match any user');
          done();
        });
    });
  });
  describe('GET: /users/:id/documents', () => {
    it('should return all documents belonging to a user given the user id', (done) => {
      chai.request(app)
        .get('/api/v1/users/1/documents')
        .set({ Authorization: adminToken })
        .end((err, res) => {
          expect(res.status).to.equal(200);
          expect(res.body).to.have.keys(['pagination', 'documents']);
          expect(res.body.documents[0].title).to.eql('My first document');
          expect(res.body.documents[0].content).to.eql('lorem ipsum and the rest of it');
          expect(res.body.documents[0].OwnerId).to.equal(1);
          done();
        });
    });
    it('should return a message for user id not in the database', (done) => {
      chai.request(app)
        .get('/api/v1/users/5/documents')
        .set({ 'Authorization': adminToken })
        .end((err, res) => {
          expect(res.status).to.equal(404);
          expect(res.body.message).to.eql('This user does not have any document.');
          done();
        });
    });
    it('should not allow a user view all of another user documents', (done) => {
      chai.request(app)
        .get('/api/v1/users/1/documents')
        .set({ Authorization: superUserToken })
        .end((err, res) => {
          expect(res.status).to.equal(403);
          expect(res.body).to.have.keys(['message']);
          expect(res.body.message).to.eql('You cannot view another user documents.');
          done();
        });
    });
  });
});
