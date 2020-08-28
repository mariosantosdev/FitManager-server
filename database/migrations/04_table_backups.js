exports.up = function (knex, Promise) {
    return knex.schema.createTable('backup_table', table => {
        table.increments('id').primary()
        table.string('data').notNullable()
        table.integer('user_id').notNullable()
            .references('id')
            .inTable('users_table')
            .onUpdate('CASCADE')
            .onDelete('CASCADE')
    })
}

exports.down = function (knex, Promise) {
    return knex.schema.dropTable('backup_table')
}