import { Product, User } from "@prisma/client";

type DbResult = {
    code: number;
    message: string;
    user?: User?,
    product?: Product?,
};

export default DbResult;