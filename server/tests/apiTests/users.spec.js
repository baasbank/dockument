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
  fakeEsther,
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
    it('should log in a user and return a token given valid email and password', (done) => {
      chai.request(app)
        .post('/api/v1/users/login')
        .send(admin).end((err, res) => {
          expect(res.status).to.equal(200);
          expect(res.body).to.have.keys(['token']);
          done();
        });
    });
    it('should return a message if password field is not supplied', (done) => {
      chai.request(app)
        .post('/api/v1/users/login')
        .send({ email: 'testing@test.com' })
        .end((err, res) => {
          expect(res.status).to.equal(400);
          expect(res.body).to.have.keys(['message']);
          expect(res.body.message).to.eql('password field is required.');
          done();
        });
    });
    it('should return a message if email field is not supplied', (done) => {
      chai.request(app)
        .post('/api/v1/users/login')
        .send({ password: 'testing123' })
        .end((err, res) => {
          expect(res.status).to.equal(400);
          expect(res.body).to.have.keys(['message']);
          expect(res.body.message[0]).to.eql('email field is required.');
          done();
        });
    });
    it('should return a message for password mismatch', (done) => {
      chai.request(app)
        .post('/api/v1/users/login')
        .send(userPasswordMismatch)
        .end((err, res) => {
          expect(res.status).to.equal(401);
          expect(res.body).to.have.keys(['message']);
          expect(res.body.message).to.eql('Password mismatch.');
          done();
        });
    });
  });
  describe('POST: /users/', () => {
    it('should return a message if fullName field is not supplied', (done) => {
      chai.request(app)
        .post('/api/v1/users/')
        .send({ email: 'femi@test.com', password: 'femi' })
        .end((err, res) => {
          expect(res.status).to.equal(400);
          expect(res.body).to.have.keys(['message']);
          expect(res.body.message).to.eql('fullName field is required.');
          done();
        });
    });
    it('should return a message if email field is not supplied', (done) => {
      chai.request(app)
        .post('/api/v1/users/')
        .send({ fullName: 'Oluwafemi Medale', password: 'femi' })
        .end((err, res) => {
          expect(res.status).to.equal(400);
          expect(res.body).to.have.keys(['message']);
          expect(res.body.message[0]).to.eql('email field is required.');
          done();
        });
    });
    it('should return a message if password field is not supplied', (done) => {
      chai.request(app)
        .post('/api/v1/users/')
        .send({ fullName: 'Oluwafemi Medale', email: 'femi@test.com' })
        .end((err, res) => {
          expect(res.status).to.equal(400);
          expect(res.body).to.have.keys(['message']);
          expect(res.body.message).to.eql('password field is required.');
          done();
        });
    });
    it('should create a new user given a name, a valid email, and password', (done) => {
      chai.request(app)
        .post('/api/v1/users/')
        .send(fakeEsther).end((err, res) => {
          expect(res.status).to.equal(201);
          expect(res.body).to.have.keys(['message', 'user']);
          expect(res.body.message).to.eql('signup successful');
          expect(res.body.user.fullName).to.eql('Esther Akwevagbe');
          expect(res.body.user.email).to.eql('esther@fake.com');
          done();
        });
    });
  });
  describe('GET: /users/', () => {
    it('should return all users if user is admin', (done) => {
      chai.request(app)
        .get('/api/v1/users')
        .set({ Authorization: adminToken })
        .end((err, res) => {
          expect(res.status).to.equal(200);
          expect(Array.isArray(res.body.users));
          expect(res.body.users[0].fullName).to.eql('Baas Bank');
          expect(res.body.users[0].email).to.eql('baas@test.com');
          expect(res.body.users[1].email).to.eql('john@test.com');
          expect(res.body.users[1].roleType).to.eql('super user');
          done();
        });
    });
    it('should return a message if a regular user accesses it', (done) => {
      chai.request(app)
        .get('/api/v1/users')
        .set({ Authorization: regularUserToken })
        .end((err, res) => {
          expect(res.status).to.equal(403);
          expect(res.body).to.have.keys(['message']);
          expect(res.body.message).to.eql('Only an admin can access this resource.');
          done();
        });
    });
    it('should paginate users if user is admin and limit and query is supplied', (done) => {
      chai.request(app)
        .get('/api/v1/users?limit=2&offset=0')
        .set({ Authorization: adminToken })
        .end((err, res) => {
          expect(res.status).to.equal(200);
          expect(Array.isArray(res.body.users));
          expect(res.body).to.have.keys(['pagination', 'users']);
          expect(res.body.pagination).to.have.keys(['totalCount', 'pageSize', 'currentPage', 'pageCount']);
          expect(res.body.pagination.totalCount).to.equal(4);
          expect(res.body.pagination.pageSize).to.equal(2);
          expect(res.body.users[0].fullName).to.eql('Baas Bank');
          expect(res.body.users[0].roleType).to.eql('admin');
          expect(res.body.users[1].id).to.equal(2);
          expect(res.body.users[1].email).to.eql('john@test.com');
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
          expect(res.body).to.have.keys(['fullName', 'roleType']);
          expect(res.body.fullName).to.eql('Baas Bank');
          expect(res.body.roleType).to.eql('admin');
          done();
        });
    });
    it('should return a message given an invalid user id', (done) => {
      chai.request(app)
        .get('/api/v1/users/jkfjdkjfld')
        .set({ Authorization: adminToken })
        .end((err, res) => {
          expect(res.status).to.equal(400);
          expect(res.body.message).to.eql('Please input a valid id.');
          done();
        });
    });
  });
  describe('PUT: /users/:id', () => {
    it('should allow a user update her profile given an id', (done) => {
      chai.request(app)
        .put('/api/v1/users/1')
        .send(updateUser)
        .set({ Authorization: adminToken })
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
        .set({ Authorization: regularUserToken })
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
        .set({ Authorization: regularUserToken })
        .end((err, res) => {
          expect(res.status).to.equal(403);
          expect(res.body).to.have.keys(['message']);
          expect(res.body.message).to.eql('User ID cannot be updated.');
          done();
        });
    });
    it('should allow an admin update a user role type given an id', (done) => {
      chai.request(app)
        .put('/api/v1/users/3')
        .send({ roleType: 'super user', email: 'blessing@test.com' })
        .set({ Authorization: adminToken })
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
    it('should allow the admin delete a user by id', (done) => {
      chai.request(app)
        .delete('/api/v1/users/3')
        .set({ Authorization: adminToken })
        .end((err, res) => {
          expect(res.status).to.equal(200);
          expect(res.body).to.have.keys(['message']);
          expect(res.body.message).to.eql('User deleted successfully.');
          done();
        });
    });
    it('should return a message for user id not in the database', (done) => {
      chai.request(app)
        .delete('/api/v1/users/5')
        .set({ Authorization: adminToken })
        .end((err, res) => {
          expect(res.status).to.equal(404);
          expect(res.body.message).to.eql('User does not exist.');
          done();
        });
    });
  });
  describe('GET: /search/users/?q={}', () => {
    it('should allow the admin search for a user by name', (done) => {
      chai.request(app)
        .get('/api/v1/search/users?q=john')
        .set({ Authorization: adminToken })
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
        .get('/api/v1/search/users?q=temilaj')
        .set({ Authorization: adminToken })
        .end((err, res) => {
          expect(res.status).to.equal(404);
          expect(res.body).to.have.keys(['message']);
          expect(res.body.message).to.eql('Search term does not match any user.');
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
          expect(res.body.documents[0].userId).to.equal(1);
          done();
        });
    });
    it('should return a message for user id not in the database', (done) => {
      chai.request(app)
        .get('/api/v1/users/5/documents')
        .set({ Authorization: adminToken })
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
