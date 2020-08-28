exports.up = function (knex, Promise) {
    return knex.schema.createTable('exercise_table', table => {
        table.increments('id').primary()
        table.string('title').notNullable()
        table.string('day_of_week').notNullable()
        table.string('loop').notNullable()
        table.string('delay_time').notNullable()
        table.integer('user_id').notNullable()
            .references('id')
            .inTable('users_table')
            .onUpdate('CASCADE')
            .onDelete('CASCADE')
    })
}

exports.down = function (knex, Promise) {
    return knex.schema.dropTable('exercise_table')
}