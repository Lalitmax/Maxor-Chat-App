import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import bodyParser from 'body-parser';
import http from 'http';
import { Server } from 'socket.io';
import dotenv from 'dotenv';
import router from './routes/users.js';

dotenv.config();
const app = express();
const server = http.createServer(app);
app.use(cors());
app.use(express.json());
app.use(bodyParser.json());


// MongoDb connection
const MONGODB_URL = process.env.MONGODB_URL;
mongoose.connect(MONGODB_URL).then(() => {
    console.log('MongoDB Connected');
}).catch((err) => {
    console.log('Mongodb Connection Error', err);
});

// Cors Handle
const corsOptions = {
    origin: '*', 
    methods: ['GET', 'POST'],
    allowedHeaders: ['Content-Type'],
    credentials: true 
};
app.use(cors(corsOptions));

const io = new Server(server, {
    cors: corsOptions
});

app.use('/api/', router);

// Socket implementation
let users = [];
io.on('connection', (socket) => {
    socket.on('new-user-joined', (username) => {
        users.push({ username, socketId: socket.id });
        console.log(`${username} connected`);
        socket.join(username);
        io.emit('new-user-joined', username);
    });

    socket.on('private_message', (data) => {
        const { text, toUser, from } = data;
        const receiverUser = users.find(user => user.username === toUser);
        console.log(data)
        if (receiverUser) {
            
            io.to(receiverUser.socketId).emit('private_message', { to: toUser, text: text, from: from });
        }
        // socket.emit('private_message', { to: toUser, text: text, from: from });
    });

    socket.on('disconnect', () => {
        users = users.filter(user => user.socketId !== socket.id);
        console.log('Client disconnected');
      });
});

server.listen(process.env.PORT, () => {
    console.log(`server running at http://localhost:${process.env.PORT}`);
});
