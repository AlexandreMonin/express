import Command from "./command";
import prisma from "../utils/database";
import DbResult from "../type/DbResult";
import bcrypt from "bcrypt";
import { PrismaClient } from "@prisma/client";
import UserRole from "../type/UserRole";

//Définir la classe User
export default class User {
  //Définir les champs
  id: number;
  lastName: String;
  firstName: String;
  email: String;
  password: String;
  role: UserRole;
  command?: Command[];

  /**
   *Define a new user
   */
  constructor({
    id,
    lastName,
    firstName,
    email,
    password,
    role,
    command,
  }: {
    id: number;
    lastName: string;
    firstName: string;
    email: string;
    password: string;
    role: UserRole;
    command?: Command[];
  }) {
    this.id = id;
    this.lastName = lastName;
    this.firstName = firstName;
    this.email = email;
    this.password = password;
    this.role = role;
    this.command = command;
  }

/**
 * Delete
 */
public async Delete(): Promise<DbResult> {
  //Définir le retour
  let result: DbResult = {
    code: 200,
    message: "User deleted",
  };

  try {
    //Chercher l'utilisateur
    const user = await prisma.user.delete({
      where: {
        email: this.email.toString(),
      },
    });

    //Assigner l'utilisateur s'il existe;
    user
      ? (result.user = user)
      : (result = { code: 500, message: "An error has occured" });

    //Retourner l'utiliateur
    return result;
  } catch (e: any) {
    //Log l'erreur
    console.error(e);

    //Créer la réponse
    if (e.code == "P2025"){
      result = {
        code: 404,
        message: "User not found",
      };
    } else {
      result = {
        code: 500,
        message: "An error has occured",
      };
    }

    //Retourner la réponse
    return result;
  }
}
}
