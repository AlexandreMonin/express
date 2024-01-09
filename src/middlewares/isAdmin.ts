import User from "../type/User";
import UserRole from "../type/UserRole";
import { Request, Response, NextFunction } from 'express';

const isAdmin = function (req: Request, res: Response, next: NextFunction){
    const user: User = req.user as User;
    
    if (user.role === UserRole.Admin){
        next();
    } else {
        return res.status(401).end();
    }
};

export default isAdmin;