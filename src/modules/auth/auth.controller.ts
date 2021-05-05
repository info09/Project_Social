import { TokenData } from "@modules/auth";
import { NextFunction, Request, Response } from "express";
import LoginDto from "./auth.dtos";
import AuthService from "./auth.service";

export default class AuthController {
  private authService = new AuthService();
  public login = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const model: LoginDto = req.body;
      const tokenData: TokenData = await this.authService.login(model);
      res.status(201).json(tokenData);
    } catch (error) {
      next(error);
    }
  };
}
