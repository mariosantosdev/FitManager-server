const { Schema, model } = require('mongoose')

const ExerciseSchema = new Schema({
    id: {
        type: Schema.Types.Number,
        auto: true
    },
    title: {
        type: Schema.Types.String,
        required: true
    },
    day_of_week: {
        type: Schema.Types.String,
        required: true
    },
    loop: {
        type: Schema.Types.String,
    },
    delay_time: {
        type: Schema.Types.String,
    },
    created_at: {
        type: Schema.Types.Date,
        required: true
    }
})

const WeightAndHeightSchema = new Schema({
    title: {
        type: Schema.Types.String,
        required: true
    },
    date: {
        type: Schema.Types.String,
        required: true
    },
    created_at: {
        type: Schema.Types.Date,
        required: true
    }
})

const BackupSchema = new Schema({
    data: {
        type: Schema.Types.String,
        required: true
    },
    created_at: {
        type: Schema.Types.Date,
        required: true
    }
})

const UserModel = new Schema({
    name: {
        type: Schema.Types.String,
        required: true
    },
    email: {
        type: Schema.Types.String,
        required: true,
        unique: true,
    },
    password: {
        type: Schema.Types.String,
        required: true
    },
    exercise: [ExerciseSchema],
    weight: [WeightAndHeightSchema],
    height: [WeightAndHeightSchema],
    backup: [BackupSchema],
    created_at: {
        type: Schema.Types.Date,
        required: true
    }
})

module.exports = model("users_table", UserModel)