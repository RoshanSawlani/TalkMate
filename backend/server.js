const express = require('express');
const { chats } = require('./data/data');
const dotenv = require('dotenv');
const connectDB = require('./config/db')
const colors = require('colors')
const userRoutes = require('./routes/userRoutes');
const chatRoutes = require('./routes/chatRoutes');
const messageRoutes = require('./routes/messageRoutes');
const { notFound, errorHandler } = require('./middleware/errorMiddleware');

dotenv.config()
connectDB()
const app = express();
app.use(express.json()) // to accept json data

app.get('/', (req, res) => {
    res.send("API is running");
})

app.use('/api/user',userRoutes)
app.use('/api/chat',chatRoutes)
app.use('/api/message',messageRoutes)

app.use(notFound)
app.use(errorHandler)

const PORT = process.env.PORT || 8082;

const server = app.listen(PORT, console.log(`server started on PORT ${PORT}`.yellow.bold));

const io = require('socket.io')(server,{
    pingTimeout:60000,
    cors:{
        origin:"http://localhost:3004"
    },
})

io.on('connection',(socket)=>{
    console.log("Connected to socket.io")

    socket.on('setup',(userData)=>{
        socket.join(userData._id)
        console.log(userData._id)
        socket.emit("Connected")
    })

    socket.on("join chat",(room)=>{
        socket.join(room)
        console.log("User joined room " + room)
    })
    
    socket.on("new message",(newMessageRecieved)=>{
        var chat = newMessageRecieved.chat;
        if(!chat.users) return console.log("chat.users not defined")
        
        chat.users.forEach((user)=>{
            if(user._id == newMessageRecieved.sender._id){
                socket.in(user._id).emit("message recieved",newMessageRecieved)
            }
        })
    })
})