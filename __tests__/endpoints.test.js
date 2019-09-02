const request = require('supertest');
const api = require('../api/server.js');

describe('POST /auth/register', function() {
  it('returns json', function(done) {
    request(api)
      .post('/api/auth/register')
      .send({
        username: `pentesterson5`, //Change to new item to test.
        password: `password`,
      })
      .expect(201, done);
  });
  it('fails if duplicate username', function(done) {
    request(api)
      .post('/api/auth/register')
      .send({
        username: `pentesterson1`,
        password: `password`,
      })
      .expect('Content-Type', /json/)
      .expect(500, done);
  });
});

describe('POST /auth/login', function() {
  it('returns json', function(done) {
    request(api)
      .post('/api/auth/login')
      .send({
        username: `pentesterson1`,
        password: `password`,
      })
      .expect('Content-Type', /json/)
      .expect(200, done);
  });
  it('fails if missing password', function(done) {
    request(api)
      .post('/api/auth/login')
      .send({
        username: `pentesterson1`,
        password: 'none',
      })
      .expect('Content-Type', /json/)
      .expect(401, done);
  });
});

describe('GET /api/jokes', function() {
  it('returns json', function() {
    request(api)
      .get('/api/jokes')
      .auth(
        // UPDATE TOKEN AS NEEDED!
        'token',
        'bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWJqZWN0IjoidXNlciIsImlhdCI6MTU2NzM5NzM5MCwiZXhwIjoxNTY3NDAwOTkwfQ.qGAzopmSE3tgZoJIvkCw5hR276uCuxchm5kl8Xe3Rdc',
      )
      .expect('Content-Type', /json/)
      .expect(200)
      .end(function(err, res) {
        if (err) return done(err);
        done();
      });
  });
  it('fails if no token', function() {
    request(api)
      .get('/api/jokes')
      .expect('Content-Type', /json/)
      .expect(401)
      .end(function(err, res) {
        if (err) return done(err);
        done();
      });
  });
});
