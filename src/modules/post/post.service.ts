import { HttpException } from "@core/exceptions";
import { UserSchema } from "@modules/users";
import { PostSchema } from ".";
import CreatePostDto from "./dto/create_post.dto";
import { IPost } from "./post.interface";

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
}
