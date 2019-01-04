const express = require('express');
const router = express.Router();
const allowOnlyPermissions = require('../middlewares/allowOnlyPermissions.js');
const {
  findRoles,
  findRolesFromOrg,
  addRole
} = require('../atomicQueries');
const {
  validateRolePayload,
} = require('../atomicValidators');
const {
  createStatusCodeError
} = require('../utils');

/* [[ VIEW ROLES ]]
 *
 * QJTE9212783101092: can view roles.
 * CEGK7839937191571: can view roles from own organization only
 */
(function() {
  const permissions = ['QJTE9212783101092', 'CEGK7839937191571']
  router.get('/', allowOnlyPermissions(permissions), async (req, res, next) => {
    const {
      requesterPermissions,
      requesterOrganizationId,
    } = res.locals

    /* {{ can view roles }} */
    if(requesterPermissions.includes(permissions[0])) {
      const roles = await findRoles();
      return res.send(roles);
    }

    /* {{ can view roles from own organization only }} */
    if(requesterPermissions.includes(permissions[1])) {
      const roles = await findRolesFromOrg(requesterOrganizationId);
      return res.send(roles);
    }
  });
})();


/* [[ ADD ROLE ]]
 *
 * FDGU5035766817354: can add a role in any organization.
 * MJFB0635032850662: can add a role in own organization only.
 */
(function() {
  const permissions = ['FDGU5035766817354', 'MJFB0635032850662']
  router.post('/', allowOnlyPermissions(permissions), async (req, res, next) => {
    const {
      requesterPermissions,
      requesterOrganizationId,
    } = res.locals

    /* {{ common validations }} */
    try{
      await validateRolePayload(req.body)
      .catch(e => { throw(e) })
    } catch(e) {
      return next(createStatusCodeError(400, 'invalid payload'))
    }
  
    /* {{ can add a role in any organization }} */
    if(requesterPermissions.includes(permissions[0])) {
      const insertedRole = await addRole(req.body);
      return res.status(201).send(insertedRole);
    }

    /* {{ can add a role in own organization only }} */
    if(requesterPermissions.includes(permissions[1])) {
      if (req.body.organization_id !== requesterOrganizationId)
        return next(createStatusCodeError(401));

      const insertedRole = await addRole(req.body);
      return res.status(201).send(insertedRole);
    }
  });
})();

module.exports = router;
