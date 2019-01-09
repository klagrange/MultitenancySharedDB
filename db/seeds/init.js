const organizations = require('../data/organizations.js');
const users = require('../data/users.js');
const goals = require('../data/goals.js');
const roles = require('../data/roles.js');
const permissions = require('../data/permissions.js');
const rolePermission = require('../data/role_permission.js');

exports.seed = function(knex, Promise) {
  return knex('organization').del()
    .then(function () {
      return knex('organization').insert(organizations);
    })
    .then(function () {
      return knex.raw('select setval(\'organization_id_seq\', max(id)) from organization');
    })

    .then(function () {
      return knex('role').del()
    })
    .then(function () {
      return knex('role').insert(roles);
    })
    .then(function () {
      return knex.raw('select setval(\'role_id_seq\', max(id)) from role');
    })

    .then(function () {
      return knex('user_sass').del()
    })
    .then(function () {
      return knex('user_sass').insert(users);
    })
    .then(function () {
      return knex.raw('select setval(\'user_sass_id_seq\', max(id)) from user_sass');
    })

    .then(function () {
      return knex('goal').del()
    })
    .then(function () {
      return knex('goal').insert(goals);
    })
    .then(function () {
      return knex.raw('select setval(\'goal_id_seq\', max(id)) from goal');
    })

    .then(function () {
      return knex('permission').del()
    })
    .then(function () {
      return knex('permission').insert(permissions);
    })
    .then(function () {
      return knex.raw('select setval(\'permission_id_seq\', max(id)) from permission');
    })

    .then(function () {
      return knex('role_permission').del()
    })
    .then(function () {
      return knex('role_permission').insert(rolePermission);
    })
    .then(function () {
      return knex.raw('select setval(\'role_permission_id_seq\', max(id)) from role_permission');
    })

};
