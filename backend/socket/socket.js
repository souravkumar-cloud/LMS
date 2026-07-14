import { Server } from "socket.io";

let io;

export const initializeSocket = (server) => {

    io = new Server(server, {
        cors: {
            origin: "http://localhost:5173",
            methods: ["GET", "POST", "PUT", "DELETE"],
            credentials: true
        }
    });

    io.on("connection", (socket) => {

        console.log(`✅ Socket Connected : ${socket.id}`);

        socket.on("join", (userId) => {

            socket.join(userId);

            console.log(`User ${userId} joined room`);

        });

        socket.on("leave", (userId) => {

            socket.leave(userId);

            console.log(`User ${userId} left room`);

        });

        socket.on("disconnect", () => {

            console.log(`❌ Socket Disconnected : ${socket.id}`);

        });

    });

};

export const getIO = () => {

    if (!io) {
        throw new Error("Socket.io is not initialized.");
    }

    return io;

};