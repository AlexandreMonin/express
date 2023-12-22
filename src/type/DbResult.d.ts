import { Product, User, Command, Products } from "@prisma/client";

type DbResult = {
  code: number;
  message: string;
  user?: User?;
  product?: Product?;
  command?: Command?;
  products?: Products? ;
};

export default DbResult;
