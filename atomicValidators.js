const { Model, ValidationError } = require('objection');
const UserSass = require('./models/UserSass');
const {
  roleIsPartOfOrg
} = require('./atomicQueries.js')


async function validateUserPayload(userPayload) {
  try {
    const user = await UserSass.fromJson(userPayload)

    if (!await roleIsPartOfOrg(user.role_id, user.organization_id)) {
      throw (Error);
    }

    return user;
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
  validateUserPayload
}
