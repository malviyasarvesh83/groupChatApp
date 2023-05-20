const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const sequelize = require('./utils/database');
const dotenv = require('dotenv').config();
const { Op } = require('sequelize');

// Import Models
const User = require('./models/user');
const Chat = require('./models/chat');
const Group = require('./models/group');
const Member = require('./models/member');

// Import Routes
const userRoutes = require('./router/userRoutes');
const chatRoutes = require('./router/chatRoutes');
const groupRoutes = require('./router/groupRoutes');

const app = express();
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cors());

const port = process.env.PORT;

const io = require("socket.io")(7000, {
    cors: {
        origin: "*",
    },
});

app.listen(port,()=>{
    console.log(`Server is Successfully on PORT: http://localhost:${port}`);
    database();
})

// Database Connection
const database = async () => {
    try {
        await sequelize.sync();
        console.log('Database Connected SuccessFully');
    } catch (error) {
        console.log('Error while connecting Database:', error.message);
    }
}

// Relation Between Tables
User.hasMany(Chat);
Chat.hasMany(User);
User.hasMany(Group);
Group.belongsTo(User);
User.hasMany(Member);
Group.hasMany(Member);

// Routes
app.use('/user', userRoutes);
app.use('/user', chatRoutes);
app.use('/user', groupRoutes);

// Socket

var usp = io.of('/user-namespace');

usp.on('connection', async (socket) => {
    console.log('User Connected');
    const userId = socket.handshake.auth.token1;
    const user = await User.findOne({ where: { id: userId } });
    user.update({ isOnline: true });

    // User boradcast online status
    socket.broadcast.emit('getOnlineUser', { id: userId });

    socket.on('disconnect', async () => {
        console.log('User Disconnected');
        const userId = socket.handshake.auth.token1;
        const user = await User.findOne({ where: { id: userId } });
        user.update({ isOnline: false });

        // User broadcast Offline status
        socket.broadcast.emit('getOfflineUser', { id: userId });
    })

    socket.on('newChat', (data, name) => {
        socket.broadcast.emit('loadNewChat', data, name);
    })

    socket.on('existsChat', async (data) => {
        const chats = await Chat.findAll({
            where: {
                [Op.or]: [
                    { senderId: data.senderId, receiverId: data.receiverId },
                    { senderId: data.receiverId, receiverId: data.senderId },
                ]
            }
        });
        socket.emit('loadChats', { chats: chats });

        // Delete Chats
        socket.on('chatDeleted', (id) => {
            socket.broadcast.emit('chatMessageDeleted', id);
        })
    })
})