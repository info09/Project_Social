import { Route } from "@core/interfaces";
import { authMiddleware } from "@core/middleware";
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

    this.router.get(this.path, this.userController.getAll);

    this.router.get(
      this.path + "/paging/:page",
      this.userController.getAllPaging
    );

    this.router.put(
      this.path + "/:id",
      validationMiddleware(RegisterDto, true),
      this.userController.updateUser
    );

    this.router.patch(
      this.path + "/:id",
      validationMiddleware(RegisterDto, true),
      this.userController.updateUser
    );

    this.router.delete(
      this.path + "/:id",
      authMiddleware,
      this.userController.deleteUser
    );
  }
}
