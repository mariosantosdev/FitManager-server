exports.up = function (knex, Promise) {
    return knex.schema.createTable('weight_table', table => {
        table.increments('id').primary()
        table.string('title').notNullable()
        table.date('date').notNullable()
        table.integer('user_id').notNullable()
            .references('id')
            .inTable('users_table')
            .onUpdate('CASCADE')
            .onDelete('CASCADE')
    })
}

exports.down = function (knex, Promise) {
    return knex.schema.dropTable('weight_table')
}