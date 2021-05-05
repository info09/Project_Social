import { Route } from "@core/interfaces";
import validationMiddleware from "@core/middleware/validation.middleware";
import { Router } from "express";
import RegisterDto from "./dtos/register.dto";
import UsersController from "./user.controller";

export default class UsersRoute implements Route {
  public path = "/api/Users";
  public router = Router();

  public userController = new UsersController();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.post(
      this.path,
      validationMiddleware(RegisterDto, true),
      this.userController.register
    );

    this.router.get(this.path + "/:id", this.userController.getUserById);

    this.router.put(
      this.path + "/:id",
      validationMiddleware(RegisterDto, true),
      this.userController.updateUser
    );
  }
}
