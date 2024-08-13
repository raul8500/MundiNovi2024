const mongoose  = require('mongoose')

const functionsUserModel = new mongoose.Schema(
    {
        nameRol: {
            type: String,
            required: true,
        },
        functions: {
            type: [String], // Array de strings
            required: true, // Si quieres que sea obligatorio
        },
    },
    {
        timestamps: true,
        versionKey: false,
    }
);


const ModelFunctionsUser = mongoose.model("functionsUser", functionsUserModel)
module.exports = ModelFunctionsUser