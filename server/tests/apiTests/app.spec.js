import chai from 'chai';
import http from 'chai-http';
import app from '../../../app';

const expect = chai.expect;
chai.use(http);

describe('*: catch-all route', () => {
  it('should return a specified message for any route not defined in routes', (done) => {
    chai.request(app)
      .get('/api/v1/undefinedRoute')
      .end((err, res) => {
        expect(res.status).to.equal(404);
        expect(res.body).to.have.keys(['message']);
        expect(res.body.message).to.eql('Error. Please check the URL and try again.');
        done();
      });
  });
});