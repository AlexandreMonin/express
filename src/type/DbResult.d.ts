type DbResult = {
    code: number;
    message: string;
    user?: {
        id: number;
        lastName: string;
        firstName: string;
        email: string;
        password: string;
    }?,
};

export default DbResult;