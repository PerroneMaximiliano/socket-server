import express from 'express';
import { SERVER_PORT } from '../global/environment';
import http from 'http';
import socketIO from 'socket.io';
import * as socket from '../sockets/socket';

export default class Server {
    public static _instance: Server;
    public app: express.Application;
    public port: number;
    public io: SocketIO.Server;
    private httpServer: http.Server;

    private constructor() {
        this.app = express();
        this.port = SERVER_PORT;
        this.httpServer = new http.Server(this.app);
        this.io = socketIO(this.httpServer);
        this.listenSockets();
    }

    public static get instance() {
        return this._instance || (this._instance = new this());
    }

    private listenSockets() {
        this.io.on('connection', client => {
            // connect client
            socket.connectClient(client, this.io);

            // config user
            socket.configUser(client, this.io);

            // message
            socket.message(client, this.io);

            // disconnect
            socket.disconnect(client, this.io);

            // listen users actives
            socket.getUsers(client, this.io);
        });
    }

    public start(callback: Function) {
        this.httpServer.listen(this.port, () => callback);
    }
}