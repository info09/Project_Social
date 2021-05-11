import { Route } from "@core/interfaces";
import { authMiddleware, validationMiddleware } from "@core/middleware";
import { Router } from "express";
import CreatePostDto from "./dto/create_post.dto";
import PostController from "./post.controller";

export default class PostRoute implements Route {
  public path = "/api/posts";
  public router = Router();

  public postController = new PostController();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.post(
      this.path,
      authMiddleware,
      validationMiddleware(CreatePostDto, true),
      this.postController.createPost
    );

    this.router.patch(
      `${this.path}/:id`,
      authMiddleware,
      validationMiddleware(CreatePostDto, true),
      this.postController.updatePost
    );

    this.router.get(`${this.path}`, this.postController.getAllPost);

    this.router.get(`${this.path}/:id`, this.postController.getPostById);

    this.router.get(
      `${this.path}/paging/:page`,
      this.postController.getPostPaging
    );
  }
}
