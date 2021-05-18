import { NextFunction, Request, Response } from "express";
import { CreateGroupDto, SetManagerDto } from ".";
import GroupService from "./group.service";

class GroupController {
  private groupService = new GroupService();

  public createGroup = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const userId = req.user.id;
      const groupDto: CreateGroupDto = req.body;
      const result = await this.groupService.createGroup(userId, groupDto);
      res.status(201).json(result);
    } catch (error) {
      next(error);
    }
  };

  public getAllGroup = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const result = await this.groupService.getAllGroup();
      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  };

  public updateGroup = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const userId: string = req.user.id;
      const groupId: string = req.params.id;
      const groupDto: CreateGroupDto = req.body;
      const result = await this.groupService.updateGroup(
        userId,
        groupId,
        groupDto
      );
      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  };

  public deleteGroup = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const userId: string = req.user.id;
      const groupId: string = req.params.id;
      const result = await this.groupService.deleteGroup(userId, groupId);
      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  };

  public joinGroup = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const userId: string = req.user.id;
      const groupId: string = req.params.id;
      const result = await this.groupService.joinGroup(userId, groupId);
      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  };

  public approvedJoinGroup = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const userId: string = req.params.userId;
      const groupId: string = req.params.groupId;
      const result = await this.groupService.approvedJoinGroup(userId, groupId);
      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  };

  public addManager = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const groupId: string = req.params.id;
      const model: SetManagerDto = req.body;
      console.log("test");
      const result = await this.groupService.addManager(groupId, model);
      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  };

  public removeManager = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const userId: string = req.params.userId;
      const groupId: string = req.params.groupId;
      const result = await this.groupService.removeManager(userId, groupId);
      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  };

  public getAllMember = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const groupId: string = req.params.id;
      const result = await this.groupService.getAllMember(groupId);
      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  };

  public removeMember = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const userId: string = req.params.userId;
      const groupId: string = req.params.groupId;
      const result = await this.groupService.removeMemberGroup(userId, groupId);
      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  };
}
export default GroupController;
