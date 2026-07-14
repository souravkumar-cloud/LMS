import { getIO } from "../socket/socket.js";

const socketEmitter = (

    room,

    event,

    data

) => {

    const io = getIO();

    if (!io) {

        return;

    }

    io.to(room.toString()).emit(

        event,

        data

    );

};

export default socketEmitter;