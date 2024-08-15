const mongoose = require('mongoose');

const userModel = new mongoose.Schema(
    {
        name: {
            type: String
        },
        username: {
            type: String
        },
        rol: {
            type: Number
        },
        password: {
            type: String
        },
        img: {
            type: Number
        },
        status: {
            type: Number
        },
        sucursalId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'sucursal',
        }
    },
    {
        timestamps: true,
        versionKey: false,
    }
);

const ModelUser = mongoose.model("users", userModel);
module.exports = ModelUser;
