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
  findOrgs,
  addOrg,
  orgExistsByName,
  deleteOrg
} = require('../atomicQueries');
const {
  validateRolePayload,
  validateOrgPayload
} = require('../atomicValidators');
const {
  createStatusCodeError
} = require('../utils');

/* [[ VIEW ORGANIZATIONS ]]
 *
 * GYQV7860011968348: can view organizations.
 */
(function() {
  const permissions = ['GYQV7860011968348']
  router.get('/', allowOnlyPermissions(permissions), async (req, res, next) => {
    const { requesterPermissions } = res.locals

    /* {{ can view organizations }} */
    if(requesterPermissions.includes(permissions[0])) {
      const orgs = await findOrgs()
      return res.send(orgs);
    }
  });
})();

/* [[ ADD ORGANIZATION ]]
 *
 * QERS6914775236148: can add a organization.
 */
(function() {
  const permissions = ['QERS6914775236148']
  router.post('/', allowOnlyPermissions(permissions), async (req, res, next) => {
    const {
      requesterPermissions,
      requesterOrganizationId,
    } = res.locals

    /* {{ common validations }} */
    try{
      await validateOrgPayload(req.body)
      .catch(e => { throw(e) })
    } catch(e) { return next(e) }
    
    const exists = await orgExistsByName(req.body.name)
    if(exists) return next(createStatusCodeError(409)) 

    /* {{ can add a organization }} */
    if(requesterPermissions.includes(permissions[0])) {
      const insertedOrg = await addOrg(req.body)
      return res.send(insertedOrg);
    }
  });
})();


/* [[ DELETE ORGANIZATION ]]
 *
 * XQXY1977826757764: can remove an organization.
 * 
 * !!! CASCADE OPERATION !!!
 * 
 */
(function() {
  const permissions = ['XQXY1977826757764']
  router.delete('/:id', allowOnlyPermissions(permissions), async (req, res, next) => {
    const orgToDelete = req.params.id;
    const { requesterPermissions } = res.locals

    if (!Number(orgToDelete)) return next(createStatusCodeError(400));

    /* {{ can remove an organization }} */
    if(requesterPermissions.includes(permissions[0])) {
      await deleteOrg(orgToDelete)
      return res.send('okay');
    }
  });
})();

module.exports = router;
