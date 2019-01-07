const { Model, ValidationError } = require('objection');
const UserSass = require('./models/UserSass');
const Role = require('./models/Role');
const Organization = require('./models/Organization');
const {
  roleIsPartOfOrg,
  permissionExists,
  roleExists
} = require('./atomicQueries.js')

const {
  createStatusCodeError
} = require('./utils');

async function validateRoleAndPermissionExistence(roleId, permissionId) {
  try {
    const p = await permissionExists(permissionId);
    const r = await roleExists(roleId);

    if(!p || !r) {
      throw (createStatusCodeError(400, 'role and/or permission does not exist'));
    }
  } catch(e) {
    throw (e);
  }
}

async function validateUserPayload(userPayload) {
  try {
    const user = await UserSass.fromJson(userPayload)

    if (!await roleIsPartOfOrg(user.role_id, user.organization_id)) {
      throw (createStatusCodeError(400, 'role not part of org'));
    }

    return user;
  } catch (e) {
    throw (e);
  }
}

async function validateRolePayload(rolePayload) {
  try {
    const role = await Role.fromJson(rolePayload)

    return role;
  } catch (e) {
    if (e instanceof ValidationError) {
      throw (ValidationError);
    } else {
      throw (e);
    }
  }
}

async function validateOrgPayload(orgPayload) {
  try {
    const org = await Organization.fromJson(orgPayload)

    return org;
  } catch (e) {
    if (e instanceof ValidationError) {
      throw (ValidationError);
    } else {
      throw (e);
    }
  }
}

// const user = {
//   name: 'Keith',
//   organization_id: 1,
//   role_id: 1
// };
//
// validateUserPayload(user)
//   .then(console.log)
//   .catch(console.log)


module.exports = {
  validateUserPayload,
  validateRolePayload,
  validateRoleAndPermissionExistence,
  validateOrgPayload
}
