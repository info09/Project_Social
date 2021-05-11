import { NextFunction, Request, Response } from "express";
import CreateCommentDto from "./dto/create_comment.dto";
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

  public deletePost = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const postId: string = req.params.id;
      const userId: string = req.user.id;
      const result = await this.postService.deletePost(userId, postId);
      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  };

  public likePost = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId: string = req.user.id;
      const postId: string = req.params.id;
      const result = await this.postService.likePost(userId, postId);
      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  };

  public unLikePost = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const userId: string = req.user.id;
      const postId: string = req.params.id;
      const result = await this.postService.unLikePost(userId, postId);
      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  };

  public addComment = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const postId: string = req.params.id;
      const userId: string = req.user.id;

      const result = await this.postService.addComment({
        text: req.body.text,
        userId: userId,
        postId: postId,
      });
      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  };

  public removeComment = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const userId: string = req.user.id;
      const postId: string = req.params.id;
      const commentId: string = req.params.comment_id;

      const result = await this.postService.removeComment(
        userId,
        postId,
        commentId
      );
      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  };
}
