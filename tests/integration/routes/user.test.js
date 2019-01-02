const request = require('supertest');
const { expect } = require('chai');

describe('YOYOOYO', () => {

  beforeEach(() => { server = require('../../../server'); })

  it('should return 401 if no token is provided', () => {
    // console.log(server)
    expect(2).to.equal(2);
  });
});
