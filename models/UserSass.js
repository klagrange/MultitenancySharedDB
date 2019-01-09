const { Model } = require('objection');

class UserSass extends Model {
  static get tableName() {
    return 'user_sass';
  }

  static get isTenantSpecific() {
    return true;
  }

  static get jsonSchema() {
    return {
      type: 'object',
      required: ['name', 'login', 'password', 'organization_id', 'role_id'],

      properties: {
        name: { type: 'string', minLength: 1, maxLength: 255 },
        login: { type: 'string', minLength: 1, maxLength: 255 },
        password: { type: 'string', minLength: 1, maxLength: 255 },
        organization_id: { type: 'number' },
        role_id: { type: 'number' },
      },
    };
  }

  static get relationMappings() {
    return {
      goals: {
        relation: Model.HasManyRelation,
        modelClass: `${__dirname}/Goal`,
        join: {
          from: 'user_sass.id',
          to: 'goal.user_id',
        },
      },
      organization: {
        relation: Model.BelongsToOneRelation,
        modelClass: `${__dirname}/Organization`,
        join: {
          from: 'user_sass.id',
          to: 'organization.id',
        },
      },
      role: {
        relation: Model.BelongsToOneRelation,
        modelClass: `${__dirname}/Role`,
        join: {
          from: 'user_sass.role_id',
          to: 'role.id',
        },
      },
    };
  }
}

module.exports = UserSass;
