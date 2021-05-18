import { Route } from "@core/interfaces";
import { authMiddleware } from "@core/middleware";
import { Router } from "express";
import { GroupController } from ".";

export default class GroupRoute implements Route {
  public path = "/api/Group";
  public router = Router();
  public groupController = new GroupController();
  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.get(`${this.path}`, this.groupController.getAllGroup);

    this.router.post(
      `${this.path}`,
      authMiddleware,
      this.groupController.createGroup
    );

    this.router.patch(
      `${this.path}/:id`,
      authMiddleware,
      this.groupController.updateGroup
    );

    this.router.delete(
      `${this.path}/:id`,
      authMiddleware,
      this.groupController.deleteGroup
    );

    this.router.patch(
      `${this.path}/joinGroup/:id`,
      authMiddleware,
      this.groupController.joinGroup
    );

    this.router.patch(
      `${this.path}/:userId/:groupId`,
      this.groupController.approvedJoinGroup
    );

    this.router.get(
      `${this.path}/member/:id`,
      this.groupController.getAllMember
    );

    this.router.patch(
      `${this.path}/member/:userId/:groupId`,
      this.groupController.removeMember
    );

    this.router.post(
      `${this.path}/manager/:id`,
      this.groupController.addManager
    );

    this.router.patch(
      `${this.path}/manager/:userId/:groupId`,
      this.groupController.removeManager
    );
  }
}
