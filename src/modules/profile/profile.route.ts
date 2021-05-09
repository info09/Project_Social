import { Route } from "@core/interfaces";
import { authMiddleware, validationMiddleware } from "@core/middleware";
import { Router } from "express";
import { ProfileController } from ".";
import AddExperienceDto from "./dtos/add_experience.dto";
import CreateProfileDto from "./dtos/create_profile.dto";

export default class ProfileRoute implements Route {
  public path = "/api/Profile";
  public router = Router();
  public profileController = new ProfileController();
  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.get(this.path, this.profileController.getAllProfile);

    this.router.get(
      `${this.path}/me`,
      authMiddleware,
      this.profileController.getProfileCurrentUser
    );

    this.router.get(
      `${this.path}/user/:id`,
      this.profileController.getProfileByUserId
    );

    this.router.post(
      `${this.path}`,
      authMiddleware,
      validationMiddleware(CreateProfileDto),
      this.profileController.createProfile
    );

    this.router.delete(
      `${this.path}`,
      authMiddleware,
      this.profileController.deleteProfile
    );

    this.router.patch(
      `${this.path}/experience`,
      authMiddleware,
      validationMiddleware(AddExperienceDto),
      this.profileController.addExperience
    );

    this.router.delete(
      `${this.path}/experience/:expId`,
      authMiddleware,
      this.profileController.deleteExperience
    );
  }
}
