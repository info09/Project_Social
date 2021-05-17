import { IUser } from "@modules/users";
import { NextFunction, Request, Response } from "express";
import { IProfile, ProfileService } from ".";
import AddEducationDto from "./dtos/add_education.dto";
import AddExperienceDto from "./dtos/add_experience.dto";
import CreateProfileDto from "./dtos/create_profile.dto";

class ProfileController {
  private profileService = new ProfileService();

  public getProfileCurrentUser = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const userId = req.user.id;
      const resultObj: Partial<IUser> =
        await this.profileService.getCurrentProfile(userId);
      res.status(200).json(resultObj);
    } catch (error) {
      next(error);
    }
  };

  public getProfileByUserId = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const userId = req.params.id;
      const profile: Partial<IUser> =
        await this.profileService.getCurrentProfile(userId);
      res.status(200).json(profile);
    } catch (error) {
      next(error);
    }
  };

  public getAllProfile = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const profile: Partial<IUser>[] =
        await this.profileService.getAllProfile();
      res.status(200).json(profile);
    } catch (error) {
      next(error);
    }
  };

  public createProfile = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const model: CreateProfileDto = req.body;
      const userId = req.user.id;
      const createProfile: IProfile = await this.profileService.createProfile(
        userId,
        model
      );
      res.status(200).json(createProfile);
    } catch (error) {
      next(error);
    }
  };

  public deleteProfile = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      await this.profileService.deleteProfile(req.user.id);
      res.status(200);
    } catch (error) {
      next(error);
    }
  };

  public addExperience = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const model: AddExperienceDto = req.body;
      const userId = req.user.id;
      const profile = await this.profileService.addExperience(userId, model);
      res.status(200).json(profile);
    } catch (error) {
      next(error);
    }
  };

  public deleteExperience = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const expId: string = req.params.expId;
      const profile = await this.profileService.deleteExperience(
        req.user.id,
        expId
      );
      res.status(200).json(profile);
    } catch (error) {
      next(error);
    }
  };

  public addEducation = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const model: AddEducationDto = req.body;
      const userId = req.user.id;
      const profile = await this.profileService.addEducation(userId, model);
      res.status(200).json(profile);
    } catch (error) {
      next(error);
    }
  };

  public deleteEducation = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const eduId: string = req.params.eduId;
      const profile = await this.profileService.deleteEducation(
        req.user.id,
        eduId
      );
      res.status(200).json(profile);
    } catch (error) {
      next(error);
    }
  };

  public follow = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const fromUserId: string = req.user.id;
      const toUserId: string = req.params.id;

      const result = await this.profileService.follow(fromUserId, toUserId);
      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  };

  public unFollow = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const fromUserId: string = req.user.id;
      const toUserId: string = req.params.id;
      const result = await this.profileService.unFollow(fromUserId, toUserId);
      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  };

  public addFriend = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const fromUserId: string = req.user.id;
      const toUserId: string = req.params.id;
      const result = await this.profileService.addFriend(fromUserId, toUserId);
      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  };

  public unFriend = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const fromUserId: string = req.user.id;
      const toUserId: string = req.params.id;
      const result = await this.profileService.unFriend(fromUserId, toUserId);
      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  };

  public acceptFriend = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const currentUserId: string = req.user.id;
      const requestUserId: string = req.params.id;
      const result = await this.profileService.acceptFriend(
        currentUserId,
        requestUserId
      );
      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  };
}

export default ProfileController;
