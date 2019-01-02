const { Model } = require('objection');

class Permission extends Model {
  static get tableName() {
    return 'permission';
  }

  static get relationMappings() {
    return {
      roles: {
        relation: Model.ManyToManyRelation,
        modelClass: `${__dirname}/Role`,
        join: {
          from: 'permission.id',
          through: {
            from: 'role_permission.permission_id',
            to: 'role_permission.role_id',
          },
          to: 'role.id',
        },
      },
    };
  }
}

module.exports = Permission;
