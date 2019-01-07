const { Model } = require('objection');

class RolePermission extends Model {
  static get tableName() {
    return 'role_permission';
  }

  static get jsonSchema() {
    return {
      type: 'object',
      required: ['role_id', 'permission_id'],

      properties: {
        role_id: { type: 'number' },
        permission_id: { type: 'number' },
      },
    };
  }

  static get relationMappings() {
    return {
      role: {
        relation: Model.BelongsToOneRelation,
        modelClass: `${__dirname}/Role`,
        join: {
          from: 'role_id',
          to: 'role.id',
        },
      },
      permission: {
        relation: Model.BelongsToOneRelation,
        modelClass: `${__dirname}/Permission`,
        join: {
          from: 'permission_id',
          to: 'permission.id',
        },
      },
    };
  }
}

module.exports = RolePermission;
