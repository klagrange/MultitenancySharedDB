exports.up = function(knex, Promise) {
  return knex.schema

    .createTable('organization', table => {
      table.increments('id').primary();
      table.string('name');
      table.string('description');
    })

    .createTable('role', table => {
      table.increments('id').primary();
      table.string('name');
      table.string('description');
      table
        .integer('organization_id')
        .unsigned()
        .references('id')
        .inTable('organization')
        .onDelete('SET NULL');
    })

    .createTable('user_sass', table => {
      table.increments('id').primary()
      table.string('name')
      table.string('login')
      table.string('password')
      table.string('token')
      table
        .integer('organization_id')
        .unsigned()
        .nullable()
        .references('id')
        .inTable('organization')
        .onDelete('SET NULL')
      table
        .integer('role_id')
        .unsigned()
        .nullable()
        .references('id')
        .inTable('role')
        .onDelete('SET NULL')
    })

    .createTable('goal', table => {
      table.increments('id').primary();
      table.string('name');
      table.string('description');
      table
        .integer('user_id')
        .unsigned()
        .references('id')
        .inTable('user_sass')
        .onDelete('SET NULL');
    })





    .createTable('permission', table => {
      table.increments('id').primary();
      table.string('code');
      table.string('description');
    })


    .createTable('role_permission', table => {
      table.increments('id').primary();
      table
        .integer('role_id')
        .unsigned()
        .references('id')
        .inTable('role')
        .onDelete('CASCADE');
      table
        .integer('permission_id')
        .unsigned()
        .references('id')
        .inTable('permission')
        .onDelete('CASCADE');
    })
};

exports.down = function(knex, Promise) {
  return knex.schema
    .dropTableIfExists('goal')
    .dropTableIfExists('permission')


};
