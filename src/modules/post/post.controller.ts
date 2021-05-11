import { NextFunction, Request, Response } from "express";
import CreatePostDto from "./dto/create_post.dto";
import PostService from "./post.service";

export default class PostController {
  private postService = new PostService();

  public createPost = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const model: CreatePostDto = req.body;
      const userId = req.user.id;
      const result = await this.postService.createPost(userId, model);
      res.status(201).json(result);
    } catch (error) {
      next(error);
    }
  };

  public updatePost = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const model: CreatePostDto = req.body;
      const postId = req.params.id;
      const result = await this.postService.updatePost(postId, model);
      res.status(201).json(result);
    } catch (error) {
      next(error);
    }
  };

  public getAllPost = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const result = await this.postService.getAllPost();
      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  };

  public getPostById = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const postId: string = req.params.id;
      const result = await this.postService.getPostById(postId);
      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  };

  public getPostPaging = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const page: number = Number(req.params.page);
      const keyword = req.query.keyword || "";
      const result = await this.postService.getPostPaging(
        keyword.toString(),
        page
      );
      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  };
}
