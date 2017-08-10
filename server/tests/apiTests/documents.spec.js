import chai from 'chai';
import http from 'chai-http';
import app from '../../../app';
import mockData from '../MockData';

const expect = chai.expect;
chai.use(http);

const { superUser, admin, documentOne, updateDocument, fakeDocument } = mockData;

let superUserToken, adminToken;

describe('Documents', () => {
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
      .send(superUser)
      .end((err, res) => {
        superUserToken = res.body.token;
        done();
      });
  });

  describe('POST: /documents/', () => {
    it('should create a new document', (done) => {
      chai.request(app)
        .post('/api/v1/documents')
        .send(documentOne)
        .set({ 'Authorization': superUserToken })
        .end((err, res) => {
          expect(res.status).to.equal(201);
          expect(res.body).to.have.keys(['message', 'details']);
          expect(res.body.details.ownerId).to.equal(2);
          done();
        });
    });
    it('should not create a new document if all fields are not supplied', (done) => {
      chai.request(app)
        .post('/api/v1/documents')
        .send(fakeDocument)
        .set({ 'Authorization': superUserToken })
        .end((err, res) => {
          expect(res.status).to.equal(400);
          expect(res.body).to.have.keys(['message']);
          expect(res.body.message).to.eql('accessType field is required.');
          done();
        });
    });
  });
  describe('GET: /documents/', () => {
    it('should display all documents', (done) => {
      chai.request(app)
        .get('/api/v1/documents')
        .set({ 'Authorization': adminToken })
        .end((err, res) => {
          expect(res.status).to.equal(200);
          expect(Array.isArray(res.body.allDocuments));
          expect(res.body.allDocuments.length).to.be.greaterThan(4);
          done();
        });
    });
    it('should fetch and paginate all documents when limit and offset are supplied', (done) => {
      chai.request(app)
        .get('/api/v1/documents?limit=2&offset=0')
        .set({ 'Authorization': adminToken })
        .end((err, res) => {
          expect(res.status).to.equal(200);
          expect(res.body).to.have.keys(['pagination', 'documents']);
          expect(res.body.pagination.pageSize).to.equal(2);
          expect(Array.isArray(res.body.documents));
          done();
        });
    });
  });
  describe('GET: /documents/:id', () => {
    it('should fetch a document given its id', (done) => {
      chai.request(app)
        .get('/api/v1/documents/1')
        .set({ 'Authorization': superUserToken })
        .end((err, res) => {
          expect(res.status).to.equal(200);
          expect(res.body).to.have.keys(['documentId', 'title', 'content', 'access', 'ownerId']);
          expect(res.body.documentId).to.equal(1);
          expect(res.body.title).to.eql('My first document');
          expect(res.body.content).to.eql('lorem ipsum and the rest of it');
          expect(res.body.access).to.eql('public');
          expect(res.body.ownerId).to.equal(1);
          done();
        });
    });
  });
  describe('PUT: /documents/:id', () => {
    it('should allow a user update her document by id', (done) => {
      chai.request(app)
        .put('/api/v1/documents/4')
        .send(updateDocument)
        .set({ 'Authorization': superUserToken })
        .end((err, res) => {
          expect(res.status).to.equal(200);
          expect(res.body).to.have.keys(['message', 'document']);
          expect(res.body.message).to.eql('Update Successful!');
          expect(res.body.document.id).to.equal(4);
          expect(res.body.document.title).to.eql('My fourth updated document');
          expect(res.body.document.content).to.equal('Fourth updated lorem ipsum things. You know how we do it.');
          expect(res.body.document.accessType).to.equal('public');
          done();
        });
    });
    it('should not allow a user update another user document', (done) => {
      chai.request(app)
        .put('/api/v1/documents/4')
        .send(updateDocument)
        .set({ 'Authorization': adminToken })
        .end((err, res) => {
          expect(res.status).to.equal(403);
          expect(res.body).to.have.keys(['message']);
          expect(res.body.message).to.eql('You can update only your documents.');
          done();
        });
    });
    it('should not allow a user update the document id', (done) => {
      chai.request(app)
        .put('/api/v1/documents/4')
        .send({ id: 5 })
        .set({ 'Authorization': superUserToken })
        .end((err, res) => {
          expect(res.status).to.equal(403);
          expect(res.body).to.have.keys(['message']);
          expect(res.body.message).to.eql('Document ID cannot be changed.');
          done();
        });
    });
  });
  describe('DELETE: /documents/:id', () => {
    it('should allow the owner of a document delete it', (done) => {
      chai.request(app)
        .delete('/api/v1/documents/2')
        .set({ 'Authorization': superUserToken })
        .end((err, res) => {
          expect(res.status).to.equal(410);
          expect(res.body).to.have.keys(['message']);
          expect(res.body.message).to.eql('Document deleted successfully.');
          done();
        });
    });
    it('should not allow a user delete another user document', (done) => {
      chai.request(app)
        .delete('/api/v1/documents/4')
        .set({ 'Authorization': adminToken })
        .end((err, res) => {
          expect(res.status).to.equal(403);
          expect(res.body).to.have.keys(['message']);
          expect(res.body.message).to.eql('You can delete only your documents.');
          done();
        });
    });
  });
  describe('GET: /search/documents/?q={doctitle}', () => {
    it('should allow a user search for documents by title', (done) => {
      chai.request(app)
        .get('/api/v1/search/documents?q=first')
        .set({ 'Authorization': superUserToken })
        .end((err, res) => {
          expect(res.status).to.equal(200);
          expect(res.body).to.have.keys(['pagination', 'documents']);
          expect(res.body.pagination.totalCount).to.equal(1);
          done();
        });
    });
    it('should return a message when document is not found', (done) => {
      chai.request(app)
        .get('/api/v1/search/documents?q=firsthead')
        .set({ 'Authorization': superUserToken })
        .end((err, res) => {
          expect(res.status).to.equal(200);
          expect(res.body).to.have.keys(['message']);
          expect(res.body.message).to.eql('Search term does not match any document');
          done();
        });
    });
  });
});
