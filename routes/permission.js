const express = require('express');

const router = express.Router();
const allowOnlyPermissions = require('../middlewares/allowOnlyPermissions.js');
const {
  findPermissions,
  findPermissionsFromOrg,
} = require('../atomicQueries');
const {
  validateOrgPayload,
} = require('../atomicValidators');
const {
  createStatusCodeError,
} = require('../utils');

/* [[ VIEW PERMISSIONS ]]
 *
 * JNLW0698833451904: can view permissions.
 * USUL3556272119368: can view permissions only from same organization.
 */
(function routeViewOrganizations() {
  async function getPermissions(res, permId, eagerRole) {
    const permissions = await findPermissions(permId, eagerRole);
    return res.send(permissions);
  }

  async function getPermissionsForOrg(res, orgId, permId, eagerRole) {
    const p = await findPermissionsFromOrg(orgId, permId, eagerRole);
    return res.send(p);
  }

  const permissions = ['JNLW0698833451904', 'USUL3556272119368'];
  router.get('/', allowOnlyPermissions(permissions), async (req, res) => {
    const { requesterPermissions, requesterOrganizationId } = res.locals;

    /* {{ can view permissions }} */
    if (requesterPermissions.includes(permissions[0])) {
      const { orgId } = req.query;
      if (orgId) {
        return getPermissionsForOrg(res, Number(orgId), req.query.permId, req.query.eagerRole);
      }
      return getPermissions(res, req.query.permId, req.query.eagerRole);
    }

    /* {{ can view permissions only from same organization }} */
    if (requesterPermissions.includes(permissions[1])) {
      return getPermissionsForOrg(res, requesterOrganizationId, req.query.permId, req.query.eagerRole);
    }

    return res.sendStatus(500);
  });
}());

module.exports = router;
