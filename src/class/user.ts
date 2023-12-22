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
   * AddToDb
   */
  public async AddToDb(isAdmin?: boolean): Promise<DbResult> {
    try {
      const encryptedPassword: string = await bcrypt.hash(
        this.password.toString(),
        15
      );

      let data = {
        lastName: this.lastName.toString(),
        firstName: this.firstName.toString(),
        email: this.email.toString(),
        password: encryptedPassword,
        role: 2
      };

      if (isAdmin) {
        data = {...data, role: 0};
      }

      //Créer l'utilisateur
      const user = await prisma.user.create({
        data: data,
      });

      //Créer la réponse
      const response: DbResult = {
        code: 201,
        message: "User created",
        user: user,
      };

      //Retourner la réponse
      return response;
    } catch (e: any) {
      //Log l'erreur
      console.error(e);

      //Créer la réponse
      let error: DbResult = {
        code: 500,
        message: "An error has occured",
      };
      if (e.code == "P2002") {
        error.code = 409;
        error.message = "Mail already existing";
        return error;
      }

      //Retourner la réponse
      return error;
    }
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
}
