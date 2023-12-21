import Command from "./command";
import prisma from "../utils/database";
import DbResult from "../type/DbResult";
import bcrypt from "bcrypt";
import { PrismaClient } from "@prisma/client";

//Définir la classe User
export default class User {
  //Définir les champs
  id: number;
  lastName: String;
  firstName: String;
  email: String;
  password: String;
  command: Command[];

  /**
   *Define a new user
   */
  constructor({
    id,
    lastName,
    firstName,
    email,
    password,
    command,
  }: {
    id: number;
    lastName: string;
    firstName: string;
    email: string;
    password: string;
    command: Command[];
  }) {
    this.id = id;
    this.lastName = lastName;
    this.firstName = firstName;
    this.email = email;
    this.password = password;
    this.command = command;
  }

  /**
   * AddToDb
   */
  public async AddToDb(): Promise<DbResult> {
    try {
      const encryptedPassword: string = await bcrypt.hash(
        this.password.toString(),
        15
      );

      //Créer l'utilisateur
      const user = await prisma.user.create({
        data: {
          lastName: this.lastName.toString(),
          firstName: this.firstName.toString(),
          email: this.email.toString(),
          password: encryptedPassword,
        },
      });

      //Créer la réponse
      const response: DbResult = {
        code: 200,
        message: "User created",
        user: user
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
}
