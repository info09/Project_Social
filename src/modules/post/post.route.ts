import { Route } from "@core/interfaces";
import { authMiddleware, validationMiddleware } from "@core/middleware";
import { Router } from "express";
import CreateCommentDto from "./dto/create_comment.dto";
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

    this.router.delete(
      `${this.path}/:id`,
      authMiddleware,
      this.postController.deletePost
    );

    this.router.patch(
      `${this.path}/like/:id`,
      authMiddleware,
      this.postController.likePost
    );

    this.router.patch(
      `${this.path}/unlike/:id`,
      authMiddleware,
      this.postController.unLikePost
    );

    this.router.patch(
      `${this.path}/comment/:id`,
      authMiddleware,
      validationMiddleware(CreateCommentDto, true),
      this.postController.addComment
    );

    this.router.patch(
      `${this.path}/comment/:id/:comment_id`,
      authMiddleware,
      this.postController.removeComment
    );

    this.router.post(
      `${this.path}/share/:id`,
      authMiddleware,
      this.postController.sharePost
    );

    this.router.delete(
      `${this.path}/share/:id`,
      authMiddleware,
      this.postController.deleteSharePost
    );
  }
}
