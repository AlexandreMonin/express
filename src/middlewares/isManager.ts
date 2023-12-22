import UserRole from "../type/UserRole";
import { Request, Response, NextFunction } from 'express';
import User from "../class/user";

const isManager = function (req: Request, res: Response, next: NextFunction){
    const user: User = req.user as User;
    
    if (user.role === UserRole.Manager){
        next();
    } else {
        return res.status(401).end();
    }
};

export default isManager;