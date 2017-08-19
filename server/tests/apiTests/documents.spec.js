import chai from 'chai';
import http from 'chai-http';
import app from '../../../app';
import mockData from '../MockData';

const expect = chai.expect;
chai.use(http);

const { superUser,
  admin,
  regularUser,
  documentOne,
  updateDocument,
  fakeDocument } = mockData;

let superUserToken;
let adminToken;
let regularUserToken;

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

  before((done) => {
    chai.request(app)
      .post('/api/v1/users/login')
      .send(regularUser)
      .end((err, res) => {
        regularUserToken = res.body.token;
        done();
      });
  });

  describe('POST: /documents/', () => {
    it('should create a new document given a title, content, and accessType', (done) => {
      chai.request(app)
        .post('/api/v1/documents')
        .send(documentOne)
        .set({ Authorization: superUserToken })
        .end((err, res) => {
          expect(res.status).to.equal(201);
          expect(res.body).to.have.keys(['message', 'document']);
          expect(res.body.document.userId).to.equal(2);
          expect(res.body.document.accessType).to.eql('public');
          done();
        });
    });
    it('should not create a new document if accessType field is not supplied', (done) => {
      chai.request(app)
        .post('/api/v1/documents')
        .send(fakeDocument)
        .set({ Authorization: superUserToken })
        .end((err, res) => {
          expect(res.status).to.equal(400);
          expect(res.body).to.have.keys(['message']);
          expect(res.body.message).to.eql('accessType field is required.');
          done();
        });
    });
    it('should not create a new document if title field is not supplied', (done) => {
      chai.request(app)
        .post('/api/v1/documents')
        .send({ content: 'lorem ipsum ipsum lorem', accessType: 'public' })
        .set({ Authorization: superUserToken })
        .end((err, res) => {
          expect(res.status).to.equal(400);
          expect(res.body).to.have.keys(['message']);
          expect(res.body.message).to.eql('Title field is required.');
          done();
        });
    });
    it('should not create a new document if content field is not supplied', (done) => {
      chai.request(app)
        .post('/api/v1/documents')
        .send({ title: 'lorem ipsum', accessType: 'public' })
        .set({ Authorization: superUserToken })
        .end((err, res) => {
          expect(res.status).to.equal(400);
          expect(res.body).to.have.keys(['message']);
          expect(res.body.message).to.eql('Content field is required.');
          done();
        });
    });
  });
  describe('GET: /documents/', () => {
    it('should display all documents', (done) => {
      chai.request(app)
        .get('/api/v1/documents')
        .set({ Authorization: adminToken })
        .end((err, res) => {
          expect(res.status).to.equal(200);
          expect(Array.isArray(res.body.allDocuments));
          expect(res.body.allDocuments[0].title).to.eql('My first document');
          expect(res.body.allDocuments[1].content).to.eql('second lorem ipsum and the rest of it');
          expect(res.body.allDocuments[2].accessType).to.eql('role');
          expect(res.body.allDocuments[3].userId).to.equal(2);
          done();
        });
    });
    it('should fetch and paginate all documents when limit and offset are supplied', (done) => {
      chai.request(app)
        .get('/api/v1/documents?limit=2&offset=0')
        .set({ Authorization: adminToken })
        .end((err, res) => {
          expect(res.status).to.equal(200);
          expect(res.body).to.have.keys(['pagination', 'documents']);
          expect(res.body.pagination).to.have.keys(['totalCount', 'currentPage', 'pageCount', 'pageSize']);
          expect(res.body.pagination.pageSize).to.equal(2);
          expect(Array.isArray(res.body.documents));
          expect(res.body.documents[0].id).to.equal(1);
          expect(res.body.documents[0].title).to.eql('My first document');
          expect(res.body.documents[0].content).to.eql('lorem ipsum and the rest of it');
          expect(res.body.documents[1].accessType).to.eql('private');
          expect(res.body.documents[1].userId).to.eql(2);
          done();
        });
    });
  });
  describe('GET: /documents/:id', () => {
    it('should fetch a document given its id', (done) => {
      chai.request(app)
        .get('/api/v1/documents/1')
        .set({ Authorization: superUserToken })
        .end((err, res) => {
          expect(res.status).to.equal(200);
          expect(res.body).to.have.keys(['id', 'title', 'content', 'accessType', 'userId']);
          expect(res.body.id).to.equal(1);
          expect(res.body.title).to.eql('My first document');
          expect(res.body.content).to.eql('lorem ipsum and the rest of it');
          expect(res.body.accessType).to.eql('public');
          expect(res.body.userId).to.equal(1);
          done();
        });
    });
    it('should return the specified message if the document does not exist', (done) => {
      chai.request(app)
        .get('/api/v1/documents/10')
        .set({ Authorization: superUserToken })
        .end((err, res) => {
          expect(res.status).to.equal(404);
          expect(res.body).to.have.keys(['message']);
          expect(res.body.message).to.eql('Document does not exist.');
          done();
        });
    });
    it('should not allow a user fetch another user private document by id', (done) => {
      chai.request(app)
        .get('/api/v1/documents/2')
        .set({ Authorization: regularUserToken })
        .end((err, res) => {
          expect(res.status).to.equal(403);
          expect(res.body).to.have.keys(['message']);
          expect(res.body.message).to.eql('Private document.');
          done();
        });
    });
  });
  describe('PUT: /documents/:id', () => {
    it('should allow a user update her document by id', (done) => {
      chai.request(app)
        .put('/api/v1/documents/4')
        .send(updateDocument)
        .set({ Authorization: superUserToken })
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
        .set({ Authorization: adminToken })
        .end((err, res) => {
          expect(res.status).to.equal(403);
          expect(res.body).to.have.keys(['message']);
          expect(res.body.message).to.eql('You can update only your documents.');
          done();
        });
    });
    it('should return the specified message for id not in the database', (done) => {
      chai.request(app)
        .put('/api/v1/documents/10')
        .set({ Authorization: adminToken })
        .end((err, res) => {
          expect(res.status).to.equal(404);
          expect(res.body).to.have.keys(['message']);
          expect(res.body.message).to.eql('Document does not exist.');
          done();
        });
    });
    it('should not allow a user update the document id', (done) => {
      chai.request(app)
        .put('/api/v1/documents/4')
        .send({ id: 5 })
        .set({ Authorization: superUserToken })
        .end((err, res) => {
          expect(res.status).to.equal(403);
          expect(res.body).to.have.keys(['message']);
          expect(res.body.message).to.eql('Document ID cannot be changed.');
          done();
        });
    });
    it('should not allow a user update the createdAt date', (done) => {
      chai.request(app)
        .put('/api/v1/documents/1')
        .send({ createdAt: '7674499404' })
        .set({ Authorization: adminToken })
        .end((err, res) => {
          expect(res.status).to.equal(403);
          expect(res.body).to.have.keys(['message']);
          expect(res.body.message).to.eql('createdAt date cannot be changed.');
          done();
        });
    });
    it('should not allow a user update the updatedAt date', (done) => {
      chai.request(app)
        .put('/api/v1/documents/1')
        .send({ updatedAt: '7674499404' })
        .set({ Authorization: adminToken })
        .end((err, res) => {
          expect(res.status).to.equal(403);
          expect(res.body).to.have.keys(['message']);
          expect(res.body.message).to.eql('updatedAt date cannot be changed.');
          done();
        });
    });
  });
  describe('DELETE: /documents/:id', () => {
    it('should allow the owner of a document delete it', (done) => {
      chai.request(app)
        .delete('/api/v1/documents/2')
        .set({ Authorization: superUserToken })
        .end((err, res) => {
          expect(res.status).to.equal(200);
          expect(res.body).to.have.keys(['message']);
          expect(res.body.message).to.eql('Document deleted successfully.');
          done();
        });
    });
    it('should not allow a user delete another user document', (done) => {
      chai.request(app)
        .delete('/api/v1/documents/4')
        .set({ Authorization: adminToken })
        .end((err, res) => {
          expect(res.status).to.equal(403);
          expect(res.body).to.have.keys(['message']);
          expect(res.body.message).to.eql('You can delete only your documents.');
          done();
        });
    });
    it('should return the specified message for id not in the database', (done) => {
      chai.request(app)
        .delete('/api/v1/documents/10')
        .set({ Authorization: superUserToken })
        .end((err, res) => {
          expect(res.status).to.equal(404);
          expect(res.body).to.have.keys(['message']);
          expect(res.body.message).to.eql('Document does not exist.');
          done();
        });
    });
  });
  describe('GET: /search/documents/?q={doctitle}', () => {
    it('should allow a user search for documents by title', (done) => {
      chai.request(app)
        .get('/api/v1/search/documents?q=first')
        .set({ Authorization: superUserToken })
        .end((err, res) => {
          expect(res.status).to.equal(200);
          expect(res.body).to.have.keys(['pagination', 'documents']);
          expect(res.body.pagination).to.have.keys(['totalCount', 'currentPage', 'pageCount', 'pageSize']);
          expect(res.body.pagination.totalCount).to.equal(1);
          expect(res.body.pagination.pageSize).to.equal(1);
          expect(res.body.documents[0].id).to.equal(1);
          expect(res.body.documents[0].title).to.eql('My first document');
          expect(res.body.documents[0].content).to.eql('lorem ipsum and the rest of it');
          expect(res.body.documents[0].accessType).to.eql('public');
          expect(res.body.documents[0].userId).to.eql(1);
          done();
        });
    });
    it('should return a message when document is not found', (done) => {
      chai.request(app)
        .get('/api/v1/search/documents?q=firsthead')
        .set({ Authorization: superUserToken })
        .end((err, res) => {
          expect(res.status).to.equal(200);
          expect(res.body).to.have.keys(['message']);
          expect(res.body.message).to.eql('Search term does not match any document');
          done();
        });
    });
  });
});
