exports.up = function(knex, Promise) {
    return knex.schema.createTable('users_table', table => {
        table.increments('id').primary()
        table.string('name').notNullable()
        table.string('email').notNullable()
        table.string('password').notNullable()
        table.datetime('created_at').notNullable()
    })
}

exports.down = function(knex, Promise) {
    return knex.schema.dropTable('users_table')
}