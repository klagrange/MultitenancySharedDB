const { Model } = require('objection');

class Organization extends Model {
  static get tableName() {
    return 'organization';
  }

  static get relationMappings() {
    return {
      users: {
        relation: Model.HasManyRelation,
        modelClass: `${__dirname}/UserSass`,
        join: {
          from: 'organization.id',
          to: 'user_sass.id',
        },
      },
      roles: {
        relation: Model.HasManyRelation,
        modelClass: `${__dirname}/Role`,
        join: {
          from: 'organization.id',
          to: 'role.organization_id',
        },
      },
    };
  }
}

module.exports = Organization;
