import { User } from "./user";

export class UserList {
    private list: User[] = [];

    constructor() { }

    // add a new user
    public add(user: User) {
        this.list.push(user);
        return user;
    }

    // update user
    public updateName(id: string, name: string) {
        for(let user of this.list) {
            if (user.id === id) {
                user.name = name;
                break;
            }
        }
    }

    // get user list
    public getList() {
        return this.list.filter(user => user.name !== 'empty');
    }

    // get an user
    public getUser(id: string) {
        return this.list.find(user => user.id === id);
    }

    // get all user of one room specific
    public getUserForRoom(room: string) {
        return this.list.filter(user => user.room === room);
    }

    // delete an user
    public deleteUser(id: string) {
        const tempUser = this.getUser(id);
        this.list = this.list.filter(user => user.id !== id);
        return tempUser;
    }
}