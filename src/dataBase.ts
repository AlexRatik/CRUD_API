import { v4 as uuidv4 } from "uuid";
import { IUser } from "./interfaces/IUser";
import { userIsValid } from "./validators/userIsValid";

export class DataBase {
    users: IUser[] = [];

    getUsers() {
        return this.users;
    }

    getUserById(id: string) {
        const user = this.users.find((user) => user.id === id);
        return user || null;
    }

    addUser(user: IUser) {
        if (userIsValid(user)) {
            const newUser = { ...user };
            newUser.id = uuidv4();
            this.users.push(newUser);
            return { ...newUser };
        } else {
            return {
                error: "Not all fields filled!",
            };
        }
    }

    updateUser(id: string, data: IUser) {
        const userIndex = this.users.findIndex((user) => user.id === id);
        if (userIndex < 0) {
            return {
                error: "No user with such id",
            };
        }
        const updatedUser = { ...this.users[userIndex], ...data };
        this.users[userIndex] = updatedUser;
        return { ...updatedUser };
    }

    deleteUser(id: string) {
        const userIndex = this.users.findIndex((user) => user.id === id);
        if (userIndex < 0) {
            return false;
        }
        this.users = this.users.filter((user) => user.id !== id);
        return true;
    }
}
