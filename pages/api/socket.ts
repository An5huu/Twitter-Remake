import { Server } from "socket.io";
import { NextApiRequest } from "next";
import { CustomNextApiResponse } from "../../types";

type CustomSocketServer = {
    io?: Server;
};

export default function handler(req: NextApiRequest, res: CustomNextApiResponse) {
    if (!res.socket) {
        res.status(500).json({ error: "Socket is not available" });
        return;
    }

    const server = res.socket.server as CustomSocketServer;

    if (!server.io) {
        console.log("Initializing Socket.IO server...");

        const io = new Server(res.socket.server, {
            path: "/api/socket",
            cors: {
                origin: "*",
                methods: ["GET", "POST"],
            },
        });

        io.on("connection", (socket) => {
            console.log(`Client connected: ${socket.id}`)
            socket.on("message", (data) => {
                socket.emit("response", `Server received: ${data}`);
            });

            socket.on("disconnect", () => {
                console.log(`Client disconnected: ${socket.id}`);
            });
        });

        server.io = io;
    }

    res.end();
}