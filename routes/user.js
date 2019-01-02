const express = require('express');
const router = express.Router();
const allowOnlyPermissions = require('../middlewares/allowOnlyPermissions.js');
const {
  findUserAll,
  findUserFromOrg,
  insertUser,
} = require('../atomicQueries');
const {
  validateUserPayload,
} = require('../atomicValidators');
const {
  createStatusCodeError
} = require('../utils');

(function() {
  const permissions = ['CJWA2387096055108', 'PPKS5796742488276']
  router.get('/', allowOnlyPermissions(permissions), async (req, res, next) => {
    /*
     * CJWA2387096055108: Can view all users.
     * PPKS5796742488276: Can view all users from same organization only.
     */
    const {
      requesterPermissions,
      requesterOrganizationId,
    } = res.locals

    if(requesterPermissions.includes(permissions[0])) {
      const users = await findUserAll();
      return res.send(users);
    }

    if(requesterPermissions.includes(permissions[1])) {
      const users = await findUserFromOrg(requesterOrganizationId);
      return res.send(users);
    }
  });
})();

(function() {
  const permissions = ['PFRY4798513053955', 'CEIG1009075525306']
  router.post('/create', allowOnlyPermissions(permissions), async (req, res, next) => {
    /*
     * PFRY4798513053955: Can add a user.
     * CEIG1009075525306: Can add a user in same organization only.
     */
    const {
      requesterPermissions,
      requesterOrganizationId,
    } = res.locals

    await validateUserPayload(req.body)
      .catch((e) => {
        next(createStatusCodeError(400))
      })

    if(requesterPermissions.includes(permissions[0])) {
      const insertedUser = await insertUser(req.body);
      return res.status(201).send(insertedUser);
    }

    if(requesterPermissions.includes(permissions[1])) {
      if (req.body.organization_id !== requesterOrganizationId)
        return next(createStatusCodeError(401));

      const insertedUser = await insertUser(req.body);
      return res.status(201).send(insertedUser);
    }
  });
})();

module.exports = router;
