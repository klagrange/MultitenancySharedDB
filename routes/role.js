const express = require('express');
const Joi = require('joi');
const router = express.Router();
const allowOnlyPermissions = require('../middlewares/allowOnlyPermissions.js');
const {
  findRoles,
  findRolesFromOrg,
  addRole,
  permissionExists,
  roleExists,
  addPermissionToRole,
  permissionIsAssignedToRole,
  roleIsFromOrg
} = require('../atomicQueries');
const {
  validateRolePayload
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

/* [[ ADD PERMISSION TO A GIVEN ROLE ]]
 *
 * OZWQ5047634703973: can add permission to existing role.
 * XMNZ4595820797783: can add permission to existing role only if the role is from own organization only.
 */
(function() {
  function validatePayload(payload) {
    const schema = {
      permissionId: Joi.number().required()
    };
    return Joi.validate(payload, schema);
  }

  const permissions = ['OZWQ5047634703973', 'XMNZ4595820797783']
  router.post('/:id/permission', allowOnlyPermissions(permissions), async (req, res, next) => {
    const {
      requesterPermissions,
      requesterOrganizationId,
    } = res.locals

    const roleId = req.params.id

    /* {{ common validations }} */
    if (!Number(roleId)) return next(createStatusCodeError(400));

    const { error } = validatePayload(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    const permissionId = req.body.permissionId
    const pExists = await permissionExists(permissionId)
    const rExists = await roleExists(roleId)
    const pIsAssignedToR = await permissionIsAssignedToRole(permissionId, roleId);

    if (!pExists) return next(createStatusCodeError(400, 'permission does not exist'));
    if (!rExists) return next(createStatusCodeError(400, 'role does not exist'));

    /* {{ can add permission to existing role }} */
    if(requesterPermissions.includes(permissions[0])) {
      if (pIsAssignedToR) res.status(201).send('okay');
      const inserted = await addPermissionToRole(roleId, permissionId)
      return res.status(201).send(inserted);
    }

    /* {{ can add permission to existing role only if the role is from own organization only }} */
    if(requesterPermissions.includes(permissions[1])) {
      const rIsFromO = await roleIsFromOrg(roleId, requesterOrganizationId)
      if(!rIsFromO) return next(createStatusCodeError(401, 'bye'));

      if (pIsAssignedToR) res.status(201).send('okay');
      const inserted = await addPermissionToRole(roleId, permissionId)
      return res.status(201).send(inserted);
    }
  });
})();



module.exports = router;
