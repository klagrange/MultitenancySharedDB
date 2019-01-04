const UserSass = require('./models/UserSass');
const Role = require('./models/Role');
const Organization = require('./models/Organization');

async function roleExists(roleId) {
  const role = await Role.query().where('id', roleId);
  return role.length > 0;
}

async function findRoles() {
  const roles = await Role.query();
  return roles;
}

async function findRolesFromOrg(orgId) {
  const roles = await Role.query().where('organization_id', orgId);
  return roles;
}

async function addRole(role) {
  const insertedRole = await Role.query().insertGraph(role);
  return insertedRole;
}

async function orgExists(orgId) {
  const org = await Organization.query().where('id', orgId);
  return org.length > 0;
}

async function roleIsPartOfOrg(roleId, orgId) {
  const role = await Role.query().where('id', roleId).andWhere('organization_id', orgId);
  return role.length > 0;
}

async function userExists(userId) {
  const user = await UserSass.query().where('id', userId);
  return user.length > 0;
}

async function deleteUser(userId) {
  const deletedUser = await UserSass.query().delete().where('id', userId);
  return deletedUser;
}

async function findUserAll() {
  const users = await UserSass.query();
  return users;
}

async function findUserById(userId) {
  const user = await UserSass.query().where('id', userId);
  return user;
}

async function findUserFromOrg(orgId) {
  const users = await UserSass.query().where('organization_id', orgId);
  return users;
}

async function insertUser(user) {
  const insertedUser = await UserSass.query().insertGraph(user);
  return insertedUser;
}

module.exports = {
  findUserAll,
  findUserFromOrg,
  roleIsPartOfOrg,
  insertUser,
  deleteUser,
  userExists,
  findUserById,
  findRoles,
  addRole,
  findRolesFromOrg
}
