import { Socket } from 'socket.io';
import socketIO from 'socket.io';
import { UserList } from '../class/user.list';
import { User } from '../class/user';

export const usersConnected = new UserList();

export const connectClient = (client: Socket, io: socketIO.Server) => {
    const user = new User(client.id);
    usersConnected.add(user);
}

export const disconnect = (client: Socket, io: socketIO.Server) => {
    client.on('disconnect', () => {
        usersConnected.deleteUser(client.id);
        io.emit('users-actives', usersConnected.getList());
    });
}

export const message = (client: Socket, io: socketIO.Server) => {
    client.on('message', (payload: {de: string, cuerpo: string}) => {
        io.emit('new-message', payload);
    });
}

export const configUser = (client: Socket, io: socketIO.Server) => {
    client.on('config-user', (payload: {name: string}, callback: Function) => {
        usersConnected.updateName(client.id, payload.name);
        io.emit('users-actives', usersConnected.getList());
        callback({
            ok: true,
            message: `User ${payload.name} configurado`
        });
    });
}

export const getUsers = (client: Socket, io: socketIO.Server) => {
    client.on('get-users', () => {
        io.to(client.id).emit('users-actives', usersConnected.getList());
    });
}