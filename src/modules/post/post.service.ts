import { HttpException } from "@core/exceptions";
import { IPagination } from "@core/interfaces";
import { UserSchema } from "@modules/users";
import { PostSchema } from ".";
import CreateCommentDto from "./dto/create_comment.dto";
import CreatePostDto from "./dto/create_post.dto";
import { IComment, ILike, IPost, IShare } from "./post.interface";

export default class PostService {
  public async createPost(
    userId: string,
    postDto: CreatePostDto
  ): Promise<IPost> {
    const user = await UserSchema.findById(userId).exec();
    if (!user) {
      throw new HttpException(400, "userId not exist");
    }

    const newPost = new PostSchema({
      text: postDto.text,
      name: user.first_name + " " + user.last_name,
      avatar: user.avatar,
      user: userId,
    });

    const post = await newPost.save();
    return post;
  }

  public async updatePost(
    postId: string,
    postDto: CreatePostDto
  ): Promise<IPost> {
    const updatePostById = await PostSchema.findByIdAndUpdate(
      postId,
      {
        ...postDto,
      },
      { new: true }
    ).exec();

    if (!updatePostById) {
      throw new HttpException(400, "Post is not found");
    }
    return updatePostById;
  }

  public async getAllPost(): Promise<IPost[]> {
    const post = await PostSchema.find().sort({ date: -1 }).exec();
    return post;
  }

  public async getPostById(postId: string): Promise<IPost> {
    const post = await PostSchema.findById(postId).exec();
    if (!post) {
      throw new HttpException(400, "Post not found");
    }
    return post;
  }

  public async getPostPaging(
    keyword: string,
    page: number
  ): Promise<IPagination<IPost>> {
    const pageSize: number = Number(process.env.PAGE_SIZE || 10);
    let query = {};
    if (keyword) {
      query = {
        $or: [{ text: { $regex: keyword } }],
      };
    }

    const post = await PostSchema.find(query)
      .skip((page - 1) * pageSize)
      .limit(pageSize)
      .exec();

    const rowCount = await PostSchema.find(query).countDocuments().exec();
    return {
      total: rowCount,
      page: page,
      pageSize: pageSize,
      items: post,
    } as IPagination<IPost>;
  }

  public async deletePost(userId: string, postId: string): Promise<IPost> {
    const post = await PostSchema.findById(postId).exec();
    if (!post) {
      throw new HttpException(400, "Post not found");
    }

    if (post.user.toString() !== userId) {
      throw new HttpException(400, "User is not authorized");
    }

    await post.remove();
    return post;
  }

  public async likePost(userId: string, postId: string): Promise<ILike[]> {
    const post = await PostSchema.findById(postId).exec();
    if (!post) {
      throw new HttpException(400, "Post not found");
    }

    if (post.likes.some((i: ILike) => i.user.toString() === userId)) {
      throw new HttpException(400, "Post already liked");
    }

    post.likes.unshift({ user: userId });
    await post.save();
    return post.likes;
  }

  public async unLikePost(userId: string, postId: string): Promise<ILike[]> {
    const post = await PostSchema.findById(postId).exec();
    if (!post) {
      throw new HttpException(400, "Post not found");
    }

    if (!post.likes.some((i: ILike) => i.user.toString() === userId)) {
      throw new HttpException(400, "Post has not yet been liked");
    }

    post.likes = post.likes.filter(({ user }) => user.toString() !== userId);
    await post.save();
    return post.likes;
  }

  public async addComment(comment: CreateCommentDto): Promise<IComment[]> {
    const post = await PostSchema.findById(comment.postId).exec();
    if (!post) {
      throw new HttpException(400, "Post not found");
    }

    const user = await UserSchema.findById(comment.userId)
      .select("-password")
      .exec();

    if (!user) {
      throw new HttpException(400, "User not found");
    }

    const newComment = {
      text: comment.text,
      name: user.first_name + " " + user.last_name,
      avatar: user.avatar,
      user: comment.userId,
    };
    post.comments.unshift(newComment as IComment);
    await post.save();
    return post.comments;
  }

  public async removeComment(
    userId: string,
    postId: string,
    commentId: string
  ): Promise<IComment[]> {
    const post = await PostSchema.findById(postId).exec();
    if (!post) {
      throw new HttpException(400, "Post not found");
    }

    const comment = post.comments.find((i) => i._id.toString() === commentId);
    if (!comment) {
      throw new HttpException(400, "Comment not found");
    }

    if (comment.user.toString() !== userId) {
      throw new HttpException(400, "user unauthorize");
    }

    post.comments = post.comments.filter(
      ({ _id }) => _id.toString() !== commentId
    );

    await post.save();
    return post.comments;
  }

  public async sharePost(userId: string, postId: string): Promise<IShare[]> {
    const post = await PostSchema.findById(postId).exec();

    if (!post) {
      throw new HttpException(400, "Post not found");
    }

    if (
      post.shares &&
      post.shares.some((share: IShare) => share.user.toString() === userId)
    ) {
      throw new HttpException(400, "Post already share");
    }

    if (!post.shares) {
      post.shares = [];
    }

    post.shares.unshift({ user: userId });
    await post.save();
    return post.shares;
  }

  public async deleteSharePost(
    userId: string,
    postId: string
  ): Promise<IShare[]> {
    const post = await PostSchema.findById(postId).exec();
    if (!post) {
      throw new HttpException(400, "Post not found");
    }

    if (!post.shares) {
      post.shares = [];
    }

    if (
      post.shares &&
      !post.shares.some((share: IShare) => share.user.toString() === userId)
    ) {
      throw new HttpException(400, "Post has not yet been share");
    }

    post.shares = post.shares.filter(({ user }) => user.toString() !== userId);
    await post.save();
    return post.shares;
  }
}
