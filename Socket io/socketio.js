const { Server } = require("socket.io");
// const Message = require("./Message");


 //   used to store online users
 const userSocketMap = {}

 
const getReceverSocketId = (userId) => {
    return userSocketMap[userId];
};

const socketHandler = (server) => {

    const io = new Server(server, {
        cors: {
            origin: "http://localhost:5177",
            methods: ["GET", "POST"],
        },
    });


    ioInstance = io

    io.on("connection", (socket) => {
        console.log("A user connected", socket.id);

        console.log("🔌 A user connected", socket.id);
        const userid = socket.handshake.query.userid

        console.log("➡️ Incoming user ID:", userid);
        if (userid) userSocketMap[userid] = socket.id;

        console.log("🟢 Online Users:", Object.keys(userSocketMap));
        // io.emit() is used to send events to all the connected clients
        io.emit("getOnlineusers", Object.keys(userSocketMap));

        // // Send chat history
        // const messages = await Message.find().sort({ _id: 1 }).limit(50);
        // socket.emit("chat_history", messages);

        // socket.on("send_message", async (data) => {
        //   console.log("Message received:", data);

        //   // Save message to DB
        //   const newMessage = new Message({
        //     message: data.message,
        //     time: data.time,
        //   });
        //   await newMessage.save();

        //   io.emit("receive_message", newMessage);
        // });



        // Fix on disconnect:
        socket.on("disconnect", () => {
            console.log("A user disconnected", socket.id);
            delete userSocketMap[userid];
            io.emit("getOnlineusers", Object.keys(userSocketMap)); // ✅ match casing
        });
    });


};

const getIO = () => ioInstance;

module.exports = {
    socketHandler,
    getReceverSocketId,
    getIO
};
