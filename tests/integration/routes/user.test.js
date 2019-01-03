const request = require('supertest');
const express = require('express');
const { expect } = require('chai');

describe('When trying to access ressources related to user', () => {
  before((done) => {
    this.knex = require('../../../startup/db');
    const app = express();
    require('../../../startup/app')(app, logErrors=false);
    this.app = app;
    done();
  })

  after(() => {
    this.knex.destroy();
  })

  it('should rejected me if I do not have an access token', () => {
    request(this.app)
      .get('/users')
      .set('token', '1')
      .expect(401)
      .end((err, res) => {
        if (err) throw err;
      })
  });
});
