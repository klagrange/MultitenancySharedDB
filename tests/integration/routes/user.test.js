const request = require('supertest');
const express = require('express');
// const { expect } = require('chai');

describe('When trying to access ressources related to user', () => {
  before((done) => {
    require('../../../startup/db');
    const app = express();
    require('../../../startup/app')(app, logErrors=false);
    this.app = app;
    done();
  });

  it('should rejected me if I have not authenticated', (done) => {
    request(this.app)
      .get('/users')
      .expect(401)
      .end((err, res) => {
        if (err) throw err;
        done();
      });
  });

  it('should be able to access the resource if I am authorized', (done) => {
    request(this.app)
      .get('/users')
      .set('token', '1')
      .expect(200)
      .end((err, res) => {
        if (err) throw err;
        done();
      });
  });

});
