const Chat = require('../models/chat');

exports.addChat = async (req, res) => {
    try {
        const { message, receiverId } = req.body;
        const { id, name } = req.user;
        const chat = await Chat.create({
            message: message,
            senderId: id,
            receiverId: receiverId,
            userId: id,
        });
        res.status(201).json({chat,name});
    } catch (error) {
        res.status(400).json({ error: 'Error while calling Add Chat Api' });
    }
}

exports.deleteChat = async (req, res) => {
    try {
        const id = req.params.id;
        const response = await Chat.findOne({ where: { id: id } });
        response.destroy();
        res.status(200).json(response);
    } catch (error) {
        res.status(400).json({ error: 'Error while calling Delete Chat Api' });
    }
}