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
   * FindByEmail
   */
  public async FindByEmail(): Promise<DbResult> {
    //Rechercher l'utilisateur
    const user = await prisma.user.findUnique({
      where: {
        email: this.email.toString(),
      },
    });

    let result: DbResult = {
      code: 200,
      message: "User found",
      user: user,
    };
    switch (user) {
      case null:
        result = {
          code: 404,
          message: "User not found",
          user: user,
        };
        break;
      default:
        result = {
          code: 200,
          message: "User found",
          user: user,
        };
        break;
    }

    return result;
  }

    /**
   * Update
newProduct: Product   */
public async Update(newUser: User): Promise<DbResult> {
  //Définir le retour
  let result: DbResult = {
    code: 201,
    message: "User updated",
  };

  try {
    const encryptedPassword: string = await bcrypt.hash(
      newUser.password.toString(),
      15
    );
    //Chercher l'utilisateur
    const user = await prisma.user.update({
      where: {
        email: this.email.toString(),
      },
      data: {
        email: newUser.email?.toString(),
        lastName: newUser.lastName?.toString(),
        firstName: newUser.firstName?.toString(),
        password: encryptedPassword,
      },
    });

    //Assigner l'utilisateur s'il existe;
    user
      ? (result.user = user)
      : (result = { code: 404, message: "User not found" });

    //Retourner l'utilisateur
    return result;
  } catch (e: any) {
    //Log l'erreur
    console.error(e);

    //Créer la réponse
    result = {
      code: 500,
      message: "An error has occured",
    };

    if (e.code == "p2025"){
      result.code = 404;
      result.message = "User not found";
    }

    //Retourner la réponse
    return result;
  }
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
