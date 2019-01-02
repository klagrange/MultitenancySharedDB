const { Model } = require('objection');

class Role extends Model {
  static get tableName() {
    return 'role';
  }

  static get isTenantSpecific() {
    return true;
  }

  static get jsonSchema() {
    return {
      type: 'object',
      required: ['name', 'organization_id'],

      properties: {
        name: { type: 'string', minLength: 1, maxLength: 255 },
        organization_id: { type: 'number' },
      },
    };
  }

  static get relationMappings() {
    return {
      organization: {
        relation: Model.BelongsToOneRelation,
        modelClass: `${__dirname}/Organization`,
        join: {
          from: 'role.organization_id',
          to: 'organization.id',
        },
      },
      users: {
        relation: Model.HasManyRelation,
        modelClass: `${__dirname}/UserSass`,
        join: {
          from: 'role.id',
          to: 'user_sass.role_id',
        },
      },
      permissions: {
        relation: Model.ManyToManyRelation,
        modelClass: `${__dirname}/Permission`,
        join: {
          from: 'role.id',
          through: {
            from: 'role_permission.role_id',
            to: 'role_permission.permission_id',
          },
          to: 'permission.id',
        },
      },
    };
  }
}

module.exports = Role;
