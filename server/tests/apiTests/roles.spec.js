import chai from 'chai';
import http from 'chai-http';
import app from '../../../app';
import models from '../../models/';
import mockData from '../MockData';


const expect = chai.expect;
chai.use(http);

const { admin } = mockData;
let adminToken;


describe('Roles', () => {
  before((done) => {
    chai.request(app)
      .post('/api/v1/users/login')
      .send(admin)
      .end((err, res) => {
        adminToken = res.body.token;
        done();
      });
  });
  after((done) => {
    models.Role.destroy({ where: { id: { $notIn: [1, 2, 3] } } });
    done();
  });

  describe('POST: /roles/', () => {
    it('should create a new role', (done) => {
      chai.request(app)
        .post('/api/v1/roles/')
        .send({ roleType: 'super admin'})
        .set({ 'Authorization': adminToken })
        .end((err, res) => {
          expect(res.status).to.equal(201);
          expect(res.body).to.have.keys(['message', 'role']);
          expect(res.body.message).to.eql('Role created successfully');
          done();
        });
    });
    it('should return a message for creation of an already existing role', (done) => {
      chai.request(app)
        .post('/api/v1/roles')
        .send({ roleType: 'admin' })
        .set({ 'Authorization': adminToken })
        .end((err, res) => {
          expect(res.status).to.equal(200);
          expect(res.body).to.have.keys(['message']);
          expect(res.body.message).to.eql('Role already exists!');
          done();
        });
    });
    it('should return a message if role type is not supplied', (done) => {
      chai.request(app)
        .post('/api/v1/roles')
        .send()
        .set({ 'Authorization': adminToken })
        .end((err, res) => {
          expect(res.status).to.equal(400);
          expect(res.body).to.have.keys(['message']);
          expect(res.body.message).to.eql('roleType field is required.');
          done();
        });
    });
  });
});
