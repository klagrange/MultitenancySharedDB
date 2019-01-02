const { Model } = require('objection');

class Goal extends Model {
  static get tableName() {
    return 'goal';
  }

  static get isTenantSpecific() {
    return true;
  }

  static get jsonSchema() {
    return {
      type: 'object',
      required: ['name', 'description', 'user_id'],

      properties: {
        name: { type: 'string', minLength: 1, maxLength: 255 },
        description: { type: 'string', minLength: 1, maxLength: 255 },
        user_id: { type: 'number' },
      },
    };
  }

  static get relationMappings() {
    return {
      user: {
        relation: Model.BelongsToOneRelation,
        modelClass: `${__dirname}/UserSass`,
        join: {
          from: 'goal.user_id',
          to: 'user_sass.id',
        },
      },
    };
  }
}

module.exports = Goal;
