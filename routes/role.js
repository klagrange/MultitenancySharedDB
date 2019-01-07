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
  roleIsFromOrg,
  deleteRolePermission,
  deleteRole
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
      // const roles = await findRoles();
      const roles = await findRoles(eager=req.query.eager, orgId=req.query.orgId)
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
    } catch(e) { return next(e) }

    /* {{ can add a role in any organization }} */
    if(requesterPermissions.includes(permissions[0])) {
      const insertedRole = await addRole(req.body);
      return res.status(201).send(insertedRole);
    }

    /* {{ can add a role in own organization only }} */
    if(requesterPermissions.includes(permissions[1])) {
      if (req.body.organization_id !== requesterOrganizationId)
        return next(createStatusCodeError(403));

      const insertedRole = await addRole(req.body);
      return res.status(201).send(insertedRole);
    }
  });
})();

/* [[ REMOVE ROLE ]]
 *
 * TAVT8651666899880: can delete a role from any organization.
 * BMMV8632489659857: can delete a role from own organization only.
 */
(function() {
  const permissions = ['TAVT8651666899880', 'BMMV8632489659857']
  router.delete('/:id', allowOnlyPermissions(permissions), async (req, res, next) => {
    const roleToDelete = req.params.id;
    const {
      requesterPermissions,
      requesterOrganizationId,
    } = res.locals

    /* {{ common validations }} */
    if (!Number(roleToDelete)) return next(createStatusCodeError(400));
  
    /* {{ can add a role in any organization }} */
    if(requesterPermissions.includes(permissions[0])) {
      await deleteRole(roleToDelete)
      return res.send('okay')
    }

    /* {{ can add a role in own organization only }} */
    if(requesterPermissions.includes(permissions[1])) {
      const roleInDb = await findRoles(eager=undefined, orgId=undefined, roleId=roleToDelete)
      if(roleInDb.length === 0) return res.send('role does not exist');

      if(roleInDb[0]['organization_id'] !== requesterOrganizationId) {
        return next(createStatusCodeError(403));
      }

      await deleteRole(roleToDelete)
      return res.send('okay')
    }
  });
})();



/* [[ ADD PERMISSION TO A GIVEN ROLE ]]
 * [[ REMOVE PERMISSION FOR A GIVEN ROLE ]]
 */
(function() {
  async function commonValidations(roleId, payload) {
    function validatePayload(payload) {
      const schema = {
        permissionId: Joi.number().required()
      };
      return Joi.validate(payload, schema);
    }

    if (!Number(roleId)) return createStatusCodeError(400);
    const { error } = validatePayload(payload);
    if (error) return createStatusCodeError(400, error.details[0].message);
  
    const permissionId = payload.permissionId
    const pExists = await permissionExists(permissionId)
    const rExists = await roleExists(roleId)

    if (!pExists) return createStatusCodeError(400, 'permission does not exist');
    if (!rExists) return createStatusCodeError(400, 'role does not exist');

    return true;
  }

  async function insert(permissionId, roleId, res) {
    const pIsAssignedToR = await permissionIsAssignedToRole(permissionId, roleId);

    if (pIsAssignedToR) return res.status(400).send('permission is already assigned to this role');
    const inserted = await addPermissionToRole(roleId, permissionId)

    return res.status(201).send(inserted);
  }

  async function del(permissionId, roleId, res) {
    await deleteRolePermission(roleId, permissionId);
    return res.sendStatus(200);
  }

  /* [[ ADD PERMISSION TO A GIVEN ROLE ]]
  *
  * OZWQ5047634703973: can add permission to existing role.
  * XMNZ4595820797783: can add permission to existing role only if the role is from own organization only.
  */
  const permissionsAdd = ['OZWQ5047634703973', 'XMNZ4595820797783']
  router.post('/:id/permission', allowOnlyPermissions(permissionsAdd), async (req, res, next) => {
    const {
      requesterPermissions,
      requesterOrganizationId,
    } = res.locals

    const roleId = req.params.id

    /* {{ common validations }} */
    const validated = await commonValidations(roleId, req.body)
    if(validated instanceof Error) return next(validated)

    /* {{ can add permission to existing role }} */
    const permissionId = req.body.permissionId
    if(requesterPermissions.includes(permissionsAdd[0])) {
      return insert(permissionId, roleId, res)
    }

    /* {{ can add permission to existing role only if the role is from own organization only }} */
    if(requesterPermissions.includes(permissionsAdd[1])) {
      const rIsFromO = await roleIsFromOrg(roleId, requesterOrganizationId)
      if(!rIsFromO) return next(createStatusCodeError(403));

      return insert(permissionId, roleId, res)
    }
  });


  /* [[ REMOVE PERMISSION FOR A GIVEN ROLE ]]
  * 
  * HZBT5391786394074: can remove a permission to existing role.
  * TOQJ0598359864173: can remove a permission to an existing role only if the role is from own organization only.
  * 
  */
  const permissionsDel = ['OZWQ5047634703973', 'XMNZ4595820797783']
  router.delete('/:id/permission', allowOnlyPermissions(permissionsDel), async (req, res, next) => {
    const {
      requesterPermissions,
      requesterOrganizationId,
    } = res.locals

    const roleId = req.params.id

    /* {{ common validations }} */
    const validated = await commonValidations(roleId, req.body)
    if(validated instanceof Error) return next(validated)

    /* {{ can add permission to existing role }} */
    const permissionId = req.body.permissionId
    if(requesterPermissions.includes(permissionsDel[0])) {
      return del(permissionId, roleId, res)
    }

    /* {{ can add permission to existing role only if the role is from own organization only }} */
    if(requesterPermissions.includes(permissionsDel[1])) {
      const rIsFromO = await roleIsFromOrg(roleId, requesterOrganizationId)
      if(!rIsFromO) return next(createStatusCodeError(403));

      return del(permissionId, roleId, res);
    }
  });
})();



module.exports = router;
