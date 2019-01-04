const {
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
} = require('./atomicQueries');


const {
  validateRolePayload
} = require('./atomicValidators');

// wire knex to objection
require('./startup/db');

// findUserById(1)
//   .then(console.log)
//   .catch(console.log)

// findRoles()
//   .then(console.log)
//   .catch(console.log)

// const role = {
//   name: 'super sayan',
//   description: 'I am responsible for nothing',
//   organization_ida: 1
// }

// addRole(role)
//   .then(console.log)
//   .catch(console.log)

// findRolesFromOrg(1)
//   .then(console.log)
//   .catch(console.log)

// validateRolePayload(role)
//   .then(console.log)
//   .catch(console.log)
