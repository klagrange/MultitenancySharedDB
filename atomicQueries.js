const UserSass = require('./models/UserSass');
const Role = require('./models/Role');
const RolePermission = require('./models/RolePermission');
const Permission = require('./models/Permission');
const Organization = require('./models/Organization');
const {
  createStatusCodeError,
} = require('./utils');

async function roleExists(roleId) {
  const role = await Role.query().where('id', roleId);
  return role.length > 0;
}

async function roleIsFromOrg(roleId, orgId) {
  const role = await Role.query().where('id', roleId).andWhere('organization_id', orgId);
  return role.length > 0;
}

async function permissionExists(permissionId) {
  const permission = await Permission.query().where('id', permissionId);
  return permission.length > 0;
}

async function permissionIsAssignedToRole(permissionId, roleId) {
  const rolePermission = await RolePermission.query().where('role_id', roleId).andWhere('permission_id', permissionId);
  return rolePermission.length > 0;
}

async function findOrgs() {
  const orgs = await Organization.query();
  return orgs;
}

async function findRoles(eager = undefined, orgId = undefined, roleId = undefined) {
  const roles = await Role
    .query()
    .skipUndefined()
    .allowEager('permissions')
    .eager(eager)
    .where('id', roleId)
    .where('organization_id', orgId);
  return roles;
}

async function findRolesFromOrg(orgId) {
  const roles = await Role.query().where('organization_id', orgId);
  return roles;
}

async function addOrg(org) {
  const insertedOrg = await Organization.query().insertGraph(org);
  return insertedOrg;
}

async function addRole(role) {
  const insertedRole = await Role.query().insertGraph(role);
  return insertedRole;
}

async function orgExistsByName(name) {
  const org = await Organization.query().where('name', name);
  return org.length > 0;
}

async function roleIsPartOfOrg(roleId, orgId) {
  const role = await Role.query().where('id', roleId).andWhere('organization_id', orgId);
  return role.length > 0;
}

async function userExists(userId) {
  const user = await UserSass.query().where('id', userId);
  return user.length > 0;
}

async function deleteRolePermission(roleId, permissionId) {
  const rolePerm = await RolePermission.query().delete().where('role_id', roleId).where('permission_id', permissionId);
  return rolePerm;
}

async function deleteUser(userId) {
  const deletedUser = await UserSass.query().delete().where('id', userId);
  return deletedUser;
}

async function deleteOrg(orgId) {
  const deletedOrg = await Organization.query().delete().where('id', orgId);
  return deletedOrg;
}

async function deleteRole(roleId) {
  const deletedRole = await Role.query().delete().where('id', roleId);
  return deletedRole;
}

async function findUserAll() {
  const users = await UserSass.query();
  return users;
}

async function findPermissions(permId = undefined, eagerRole = undefined) {
  const permissions = Permission
    .query()
    .skipUndefined()
    .allowEager('roles')
    .where('id', permId);

  if (eagerRole) {
    return permissions.eager('roles');
  }

  return permissions;
}

async function findPermissionsFromOrg(orgId, permId = undefined, eagerRole = undefined) {
  /*
   * [TODO]: perhaps a direct join query would be more efficient?
   */
  const permissions = await Permission
    .query()
    .eager('roles');

  const pInOrg = permissions.filter((el) => {
    const f = el.roles.filter((role) => {
      return role.organization_id === orgId;
    });
    return f.length > 0;
  });

  const p = Permission
    .query()
    .skipUndefined()
    .allowEager('roles')
    .whereIn('id', pInOrg.map(p => p.id))
    .where('id', permId);

  if (eagerRole) {
    return p.eager('roles');
  }

  return p;
}

async function findUsers(eagerOrg = undefined, eagerRole = undefined,
  userId = undefined, orgId = undefined, login = undefined) {
  const users = UserSass
    .query()
    .skipUndefined()
    .allowEager('[organization, role.permissions]')
    .where('organization_id', orgId)
    .where('login', login)
    .where('id', userId);

  if (eagerOrg && eagerRole) {
    return users.eager('[role.permissions, organization]');
  }

  if (eagerOrg && !eagerRole) {
    return users.eager('organization');
  }

  if (eagerRole && !eagerOrg) {
    return users.eager('role.permissions');
  }

  return users;
}

async function findUserFromOrg(orgId) {
  const users = await UserSass.query().where('organization_id', orgId);
  return users;
}

async function insertUser(user) {
  const insertedUser = await UserSass.query().insertGraph(user);
  return insertedUser;
}

async function findPermissionById(permissionId) {
  const permission = await Permission.query().where('id', permissionId).first();
  return permission || null;
}

async function addPermissionToRole(roleId, permissionId) {
  const roles = await findRoles(eager = undefined, orgId = undefined, roleId = roleId);
  const role = roles[0];
  if (!role) throw createStatusCodeError(500, 'role does not exist');

  const permission = await findPermissionById(permissionId);
  if (!permission) throw createStatusCodeError(500, 'permission does not exist');

  const inserted = await role.$relatedQuery('permissions').relate(permissionId);

  return inserted;
}

module.exports = {
  findUserAll,
  findUserFromOrg,
  roleIsPartOfOrg,
  insertUser,
  deleteUser,
  userExists,
  findRoles,
  addRole,
  findRolesFromOrg,
  addPermissionToRole,
  findPermissionById,
  permissionExists,
  roleExists,
  permissionIsAssignedToRole,
  roleIsFromOrg,
  findOrgs,
  addOrg,
  orgExistsByName,
  deleteRolePermission,
  deleteOrg,
  deleteRole,
  findUsers,
  findPermissions,
  findPermissionsFromOrg,
};
