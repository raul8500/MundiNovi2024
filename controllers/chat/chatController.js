const Message = require('../../schemas/mensajes/mensajesSchema');

exports.chatDelete = async (req, res) => {
    try {
        await Message.deleteMany({});
        res.status(200).json({ message: 'Mensajes eliminados correctamente' });
    } catch (error) {
        res.status(500).json({ error: 'Error al eliminar los mensajes' });
    }
}