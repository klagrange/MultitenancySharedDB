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
  const permissions = ['FDGU5035766817354', 'MJFB0635032850662']
  router.post('/', allowOnlyPermissions(permissions), async (req, res, next) => {
    /*
     * FDGU5035766817354: Can add a role in any organization.
     * MJFB0635032850662: Can add a role in own organization only.
     */
    const {
      requesterPermissions,
      requesterOrganizationId,
    } = res.locals

    if(requesterPermissions.includes(permissions[0])) {
      return res.send('can add in any organization');
    }

    if(requesterPermissions.includes(permissions[1])) {
      return res.send('can add in own organization only');
    }
  });
})();

module.exports = router;
