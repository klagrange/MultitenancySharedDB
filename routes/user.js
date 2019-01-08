const express = require('express');

const router = express.Router();
const allowOnlyPermissions = require('../middlewares/allowOnlyPermissions.js');
const {
  insertUser,
  deleteUser,
  findUserById,
  findUsers,
} = require('../atomicQueries');
const {
  validateUserPayload,
} = require('../atomicValidators');
const {
  createStatusCodeError,
} = require('../utils');


/* [[ VIEW USERS ]]
 *
 * CJWA2387096055108: can view all users.
 * PPKS5796742488276: can view all users from same organization only.
 */
(function routeViewUsers() {
  const permissions = ['CJWA2387096055108', 'PPKS5796742488276'];
  router.get('/', allowOnlyPermissions(permissions), async (req, res) => {
    const {
      requesterPermissions,
      requesterOrganizationId,
    } = res.locals;

    /* {{ can view all users }} */
    if (requesterPermissions.includes(permissions[0])) {
      const users = await findUsers(eagerOrg = req.query.eagerOrg, eagerRole = req.query.eagerOrg, orgId = req.query.orgId, login = req.query.login);
      return res.send(users);
    }

    /* {{ can view aller users from same organization only }} */
    if (requesterPermissions.includes(permissions[1])) {
      const users = await findUsers(eagerOrg = req.query.eagerOrg, eagerRole = req.query.eagerOrg, orgId = requesterOrganizationId, login = req.query.login);
      return res.send(users);
    }

    return res.end();
  });
}());


/* [[ ADD USER ]]
 *
 * PFRY4798513053955: can add a user.
 * CEIG1009075525306: can add a user in same organization only.
 */
(function routeAddUser() {
  async function insert(req, res) {
    const insertedUser = await insertUser(req.body);
    return res.status(201).send(insertedUser);
  }

  const permissions = ['PFRY4798513053955', 'CEIG1009075525306'];
  router.post('/', allowOnlyPermissions(permissions), async (req, res, next) => {
    const {
      requesterPermissions,
      requesterOrganizationId,
    } = res.locals;

    /* {{ common validations }} */
    try {
      await validateUserPayload(req.body)
        .catch((e) => { throw (e); });
    } catch (e) { return next(e); }

    const { login } = req.body;
    const usersWithSameLogin = await findUsers(undefined, undefined, undefined, login);
    if (usersWithSameLogin.length > 0) {
      return next(createStatusCodeError(409));
    }

    /* {{ can add a user }} */
    if (requesterPermissions.includes(permissions[0])) {
      return insert(req, res);
    }

    /* {{ can add a user in same organization only }} */
    if (requesterPermissions.includes(permissions[1])) {
      if (req.body.organization_id !== requesterOrganizationId) {
        return next(createStatusCodeError(403));
      }
      return insert(req, res);
    }

    return res.end();
  });
}());

/* [[ DELETE USER ]]
 *
 * OMZL0480317045830: can delete user from any organization.
 * SAUU7318408312338: can delete user from own organization only.
 */
(function routeDeleteUser() {
  const permissions = ['OMZL0480317045830', 'SAUU7318408312338'];
  router.delete('/:id', allowOnlyPermissions(permissions), async (req, res, next) => {
    const userIdToDelete = req.params.id;
    const {
      requesterPermissions,
      requesterOrganizationId,
    } = res.locals;

    /* {{ common validations }} */
    const userInDb = await findUserById(userIdToDelete);
    if (userInDb.length === 0) {
      return next(createStatusCodeError(500, 'user is dead'));
    }

    /* {{ can delete user from any organization }} */
    if (requesterPermissions.includes(permissions[0])) {
      deleteUser(userIdToDelete);
      return res.send('okay');
    }

    /* {{ can delete user from own organization only }} */
    if (requesterPermissions.includes(permissions[1])) {
      if (userInDb[0].organization_id !== requesterOrganizationId) {
        return next(createStatusCodeError(403));
      }

      deleteUser(userIdToDelete);
      return res.send('okay');
    }

    return res.end();
  });
}());

module.exports = router;
