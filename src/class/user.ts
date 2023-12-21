import Command from "./command";

//Définir la classe User
export default class User {
  //Définir les champs
  id: number;
  lastname: String;
  firstname: String;
  email: String;
  password: String;
  command: Command[]

  /**
   *Define a new user
   */
  constructor(
    id: number,
    lastname: String,
    firstname: String,
    email: String,
    password: String,
    command: Command[]
  ) {
    this.id = id;
    this.lastname = lastname;
    this.firstname = firstname;
    this.email = email;
    this.password = password;
    this.command = command;
  }
}
