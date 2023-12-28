import Command from "../class/command";
import UserRole from "./UserRole";

type User = {
    id: number;
    lastName: String;
    firstName: String;
    email: String;
    password: String;
    role: UserRole;
    command?: Command[];
};

export default User;