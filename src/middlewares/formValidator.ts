import { body, validationResult } from "express-validator";
import { NextFunction, Request, Response } from "express";

export const signinValidator = [
  body("email").notEmpty().withMessage("email is required"),
  body("password").notEmpty().withMessage("password is required"),
  async (req: Request, res: Response, next: NextFunction) => {
    const result = validationResult(req);
    console.log(result);
    if (result.isEmpty()) {
      next();
    }
    else{
      res.status(409).send({ errors: result.array() });
    }
  },
];
