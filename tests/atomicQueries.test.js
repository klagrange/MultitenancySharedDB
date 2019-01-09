const { assert } = require('chai');

const {
  findUsers,
  insertUser,
  deleteUser,
} = require('../atomicQueries');

const usersInit = require('../db/data/users.js');
const rolesInit = require('../db/data/roles.js');
const orgsInit = require('../db/data/organizations.js');

describe('Atomic queries', () => {
  before((done) => {
    require('../startup/db');

    const randomRole = rolesInit[0];
    const oneOrgId = randomRole.organization_id;
    const rolesForGivenOrg = rolesInit.filter(role => role.organization_id === oneOrgId);
    const nonExistentOrgId = Math.max.apply(null, orgsInit.map(org => org.id)) + 1000;
    const nonExistentRoleId = Math.max.apply(null, rolesInit.map(role => role.id)) + 1000;

    this.oneOrgId = oneOrgId;
    this.rolesForGivenOrg = rolesForGivenOrg;

    this.nonExistentOrgId = nonExistentOrgId;
    this.nonExistentRoleId = nonExistentRoleId;

    done();
  });

  it('insertUser given user payload is correct', async () => {
    // insert user
    const userToInsert = {
      name: "patrick",
      login: "patrick@bambu.life",
      password: "mypassword",
      organization_id: this.oneOrgId,
      role_id: this.rolesForGivenOrg[0].id,
    };

    const insertedUser = await insertUser(userToInsert);

    // retrieve users
    const users = await findUsers(eagerOrg = undefined, eagerRole = undefined,
      userId = undefined, orgId = undefined, login = undefined);

    // ensure the total number of users have increased by one.
    this.insertUser = insertedUser;
    assert.equal(users.length, usersInit.length + 1);
  });

  it('insertUser in non existent org', async () => {
    const userToInsert = {
      name: "patrick",
      login: "patrick@bambu.life",
      password: "mypassword",
      organization_id: this.nonExistentOrgId,
      role_id: this.rolesForGivenOrg[0].id,
    };

    await insertUser(userToInsert)
      .then(() => assert.fail('should have not inserted user!'))
      .catch(() => assert.equal(1, 1));
  });

  it('insertUser in non existent role', async () => {
    const userToInsert = {
      name: 'patrick',
      login: 'patrick@bambu.life',
      password: 'mypassword',
      organization_id: orgsInit[0].id,
      role_id: this.nonExistentRoleId,
    };

    await insertUser(userToInsert)
      .then(() => assert.equal(1, 2))
      .catch(() => assert.equal(1, 1));
  });

  it('deleteUser should correctly delete user', async () => {
    await deleteUser(this.insertUser.id);
  });

  it('findUsers retrieves all users in the db', async () => {
    const users = await findUsers(eagerOrg = undefined, eagerRole = undefined,
      userId = undefined, orgId = undefined, login = undefined);

    assert.equal(users.length, usersInit.length);
  });

  it('findUsers with eager options retrieves all users in the db', async () => {
    const users = await findUsers(eagerOrg = true, eagerRole = true,
      userId = undefined, orgId = undefined, login = undefined);
    assert.equal(users.length, usersInit.length);
  });

  it('findUsers from a specific org retrieves all users ONLY from that org in the db', async () => {
    const myOrgId = 5;

    const users = await findUsers(eagerOrg = undefined, eagerRole = undefined,
      userId = undefined, orgId = myOrgId, login = undefined);

    const inDb = users.filter(user => user.organization_id === myOrgId);

    assert.equal(users.length, inDb.length);
  });
});