import type { Server as HttpServer } from "http";
import type { Server as IOServer } from "socket.io";
import type { NextApiResponse } from "next";
import type { Socket } from "net";

export interface PostInterface {
    id: string;
    timestamp: Date;
    content: string;
    author: string;
    likes: number;
    avatar: string;
    username: string;
    liked: boolean;
}

interface CustomSocketServer extends HttpServer {
    io?: IOServer;
}

export interface CustomNextApiResponse extends NextApiResponse {
    socket: Socket & {
        server: CustomSocketServer;
    };
}