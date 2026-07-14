import { io } from "socket.io-client";

const socket = io("http://localhost:5000", {
    autoConnect: false
});

export const connectSocket = (userId) => {

    if (!socket.connected) {

        socket.connect();

    }

    socket.emit("join", userId);

};

export default socket;