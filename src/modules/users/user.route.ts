import { Route } from "@core/interfaces";
import { Router } from "express";
import UsersController from "./user.controller";

export default class UsersRoute implements Route {
  public path = "/api/Users";
  public router = Router();

  public userController = new UsersController();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.post(this.path, this.userController.register);
  }
}
